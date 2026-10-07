import type { Prisma } from '@prisma/client'
import {
  hasPermission,
  isInstructorRole,
  isManagerRole,
  PERMISSIONS,
  requireManagerDepartment,
  type Actor,
} from '@/server/auth/permissions'
import { db } from '@/server/db'
import { forbidden } from '@/server/http/errors'
import { certificateStatus } from '@/server/modules/certificates/certificate-status'
import { fullName } from '@/server/modules/users/mapper'
import type {
  AssessmentReportRowDto,
  AuditReportRowDto,
  CertificateReportRowDto,
  CourseReportRowDto,
  CourseStatus,
  LearnerReportRowDto,
  LibraryReportRowDto,
  ReportOverviewDto,
  ReportType,
  ResourceType,
} from '@/shared/dto'
import { canViewReports, LEARNER_ROLES } from '@/shared/roles'
import { average, lastMonths, monthKey, rate } from './time-series'

interface Scope {
  course: Prisma.CourseWhereInput
  user: Prisma.UserWhereInput
  enrollment: Prisma.EnrollmentWhereInput
  attempt: Prisma.QuizAttemptWhereInput
  certificate: Prisma.CertificateWhereInput
}

/**
 * Report scope by role: administrators see the organization, department
 * managers their department, instructors the courses they own.
 */
function resolveScope(actor: Actor): Scope {
  if (!canViewReports(actor.role)) throw forbidden()
  if (hasPermission(actor.role, PERMISSIONS.REPORTS_VIEW_ALL)) {
    return { course: {}, user: {}, enrollment: {}, attempt: {}, certificate: {} }
  }
  if (isManagerRole(actor.role)) {
    const department = requireManagerDepartment(actor)
    const user = { department }
    return { course: {}, user, enrollment: { user }, attempt: { user }, certificate: { user } }
  }
  if (isInstructorRole(actor.role)) {
    const course: Prisma.CourseWhereInput = { OR: [{ tutorId: actor.id }, { createdBy: actor.id }] }
    return {
      course,
      user: { enrollments: { some: { course } } },
      enrollment: { course },
      attempt: { quiz: { OR: [{ createdBy: actor.id }, { course }] } },
      certificate: { course },
    }
  }
  throw forbidden()
}

export async function overviewReport(actor: Actor): Promise<ReportOverviewDto> {
  const scope = resolveScope(actor)
  const months = lastMonths(12)
  const since = new Date(`${months[0]}-01T00:00:00.000Z`)

  const [learners, courses, enrollments, attempts, certificates, downloads] = await Promise.all([
    db.user.count({ where: { AND: [{ role: { in: [...LEARNER_ROLES] }, isActive: true }, scope.user] } }),
    db.course.count({ where: { AND: [{ status: 'published' }, scope.course] } }),
    db.enrollment.findMany({ where: scope.enrollment, select: { status: true, startedAt: true, completedAt: true } }),
    db.quizAttempt.findMany({ where: { AND: [{ status: 'graded' }, scope.attempt] }, select: { percentage: true, passed: true } }),
    db.certificate.findMany({ where: { AND: [{ status: 'active' }, scope.certificate] }, select: { issuedAt: true } }),
    db.resourceDownload.count({ where: isManagerRole(actor.role) ? { user: scope.user } : {} }),
  ])

  const monthly = new Map(months.map((month) => [month, { month, enrollments: 0, completions: 0, certificates: 0 }]))
  for (const enrollment of enrollments) {
    if (enrollment.startedAt >= since) monthly.get(monthKey(enrollment.startedAt))!.enrollments += 1
    if (enrollment.completedAt && enrollment.completedAt >= since) monthly.get(monthKey(enrollment.completedAt))!.completions += 1
  }
  for (const certificate of certificates) {
    if (certificate.issuedAt >= since) monthly.get(monthKey(certificate.issuedAt))!.certificates += 1
  }

  const buckets = ['0–39', '40–59', '60–69', '70–79', '80–89', '90–100']
  const bucketOf = (value: number) => (value < 40 ? 0 : value < 60 ? 1 : value < 70 ? 2 : value < 80 ? 3 : value < 90 ? 4 : 5)
  const distribution = buckets.map((range) => ({ range, count: 0 }))
  for (const attempt of attempts) distribution[bucketOf(attempt.percentage)].count += 1

  const completed = enrollments.filter((enrollment) => enrollment.status === 'completed').length
  return {
    totals: {
      learners,
      courses,
      enrollments: enrollments.length,
      completed,
      completionRate: rate(completed, enrollments.length),
      attempts: attempts.length,
      passRate: rate(attempts.filter((attempt) => attempt.passed).length, attempts.length),
      averageScore: average(attempts.map((attempt) => attempt.percentage)),
      certificates: certificates.length,
      downloads,
    },
    monthly: [...monthly.values()],
    scoreDistribution: distribution,
  }
}

export async function learnersReport(actor: Actor): Promise<LearnerReportRowDto[]> {
  const scope = resolveScope(actor)
  const learners = await db.user.findMany({
    where: { AND: [{ role: { in: [...LEARNER_ROLES] } }, scope.user] },
    include: {
      enrollments: { where: scope.enrollment, select: { status: true, progress: true } },
      quizAttempts: { where: { AND: [{ status: 'graded' }, scope.attempt] }, select: { percentage: true, passed: true } },
      certificates: { where: { AND: [{ status: 'active' }, scope.certificate] }, select: { id: true } },
    },
    orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
  })
  return learners.map((learner) => ({
    id: learner.id,
    name: fullName(learner),
    email: learner.email,
    department: learner.department,
    position: learner.position,
    enrolled: learner.enrollments.length,
    completed: learner.enrollments.filter((enrollment) => enrollment.status === 'completed').length,
    averageProgress: average(learner.enrollments.map((enrollment) => enrollment.progress)),
    attempts: learner.quizAttempts.length,
    passed: learner.quizAttempts.filter((attempt) => attempt.passed).length,
    averageScore: learner.quizAttempts.length ? average(learner.quizAttempts.map((attempt) => attempt.percentage)) : null,
    certificates: learner.certificates.length,
    lastLoginAt: learner.lastLoginAt?.toISOString() ?? null,
  }))
}

export async function coursesReport(actor: Actor): Promise<CourseReportRowDto[]> {
  const scope = resolveScope(actor)
  const courses = await db.course.findMany({
    where: { AND: [{ status: { not: 'archived' } }, scope.course] },
    include: {
      category: { select: { name: true } },
      tutor: { select: { firstName: true, lastName: true } },
      _count: { select: { lessons: true } },
      enrollments: { where: scope.enrollment, select: { status: true, progress: true } },
      certificates: { where: { AND: [{ status: 'active' }, scope.certificate] }, select: { id: true } },
      quizzes: { select: { attempts: { where: { AND: [{ status: 'graded' }, scope.attempt] }, select: { percentage: true } } } },
    },
    orderBy: { title: 'asc' },
  })
  return courses.map((course) => {
    const scores = course.quizzes.flatMap((quiz) => quiz.attempts.map((attempt) => attempt.percentage))
    const completed = course.enrollments.filter((enrollment) => enrollment.status === 'completed').length
    return {
      id: course.id,
      title: course.title,
      category: course.category?.name ?? null,
      tutor: course.tutor ? `${course.tutor.lastName} ${course.tutor.firstName}` : null,
      status: course.status as CourseStatus,
      lessons: course._count.lessons,
      enrolled: course.enrollments.length,
      completed,
      completionRate: rate(completed, course.enrollments.length),
      averageProgress: average(course.enrollments.map((enrollment) => enrollment.progress)),
      averageScore: scores.length ? average(scores) : null,
      certificates: course.certificates.length,
    }
  })
}

export async function assessmentsReport(actor: Actor): Promise<AssessmentReportRowDto[]> {
  const scope = resolveScope(actor)
  const attempts = await db.quizAttempt.findMany({
    where: { AND: [{ status: 'graded' }, scope.attempt] },
    include: {
      user: { select: { firstName: true, lastName: true, middleName: true, email: true } },
      quiz: { select: { title: true, course: { select: { title: true } } } },
    },
    orderBy: { submittedAt: 'desc' },
    take: 1000,
  })
  return attempts.map((attempt) => ({
    id: attempt.id,
    learner: fullName(attempt.user),
    email: attempt.user.email,
    quiz: attempt.quiz.title,
    course: attempt.quiz.course?.title ?? null,
    score: attempt.score,
    maxScore: attempt.maxScore,
    percentage: attempt.percentage,
    passed: attempt.passed,
    submittedAt: attempt.submittedAt?.toISOString() ?? null,
    timeSpentSec: attempt.timeSpentSec,
  }))
}

export async function certificatesReport(actor: Actor): Promise<CertificateReportRowDto[]> {
  const scope = resolveScope(actor)
  const certificates = await db.certificate.findMany({
    where: scope.certificate,
    include: {
      user: { select: { firstName: true, lastName: true, middleName: true, department: true } },
      course: { select: { title: true } },
    },
    orderBy: { issuedAt: 'desc' },
    take: 1000,
  })
  return certificates.map((certificate) => ({
    id: certificate.id,
    certNumber: certificate.certNumber,
    learner: fullName(certificate.user),
    department: certificate.user.department,
    course: certificate.course.title,
    percentage: certificate.percentage,
    issuedAt: certificate.issuedAt.toISOString(),
    validUntil: certificate.validUntil?.toISOString() ?? null,
    status: certificateStatus(certificate),
  }))
}

export async function libraryReport(actor: Actor): Promise<LibraryReportRowDto[]> {
  resolveScope(actor)
  const resources = await db.libraryResource.findMany({
    where: { status: 'active' },
    include: { _count: { select: { bookmarks: true } } },
    orderBy: [{ downloadCount: 'desc' }, { viewCount: 'desc' }],
  })
  return resources.map((resource) => ({
    id: resource.id,
    title: resource.title,
    type: resource.type as ResourceType,
    category: resource.category,
    views: resource.viewCount,
    downloads: resource.downloadCount,
    bookmarks: resource._count.bookmarks,
  }))
}

export async function auditReport(actor: Actor): Promise<AuditReportRowDto[]> {
  if (!hasPermission(actor.role, PERMISSIONS.AUDIT_VIEW)) throw forbidden()
  const logs = await db.activityLog.findMany({
    include: { user: { select: { firstName: true, lastName: true, email: true, role: true } } },
    orderBy: { createdAt: 'desc' },
    take: 500,
  })
  return logs.map((log) => ({
    id: log.id,
    user: `${log.user.lastName} ${log.user.firstName}`,
    email: log.user.email,
    role: log.user.role,
    action: log.action,
    entity: log.entity,
    entityId: log.entityId,
    ipAddress: log.ipAddress,
    createdAt: log.createdAt.toISOString(),
  }))
}

export async function buildReport(actor: Actor, type: ReportType) {
  switch (type) {
    case 'overview':
      return overviewReport(actor)
    case 'learners':
      return learnersReport(actor)
    case 'courses':
      return coursesReport(actor)
    case 'assessments':
      return assessmentsReport(actor)
    case 'certificates':
      return certificatesReport(actor)
    case 'library':
      return libraryReport(actor)
    case 'audit':
      return auditReport(actor)
  }
}
