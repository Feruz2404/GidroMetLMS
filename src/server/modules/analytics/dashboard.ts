import type { Prisma } from '@prisma/client'
import {
  hasPermission,
  isInstructorRole,
  isLearnerRole,
  isManagerRole,
  PERMISSIONS,
  requireManagerDepartment,
  type Actor,
} from '@/server/auth/permissions'
import { db } from '@/server/db'
import { courseCardInclude, toCourseCard } from '@/server/modules/courses/mapper'
import { orderLessons } from '@/server/modules/courses/progress'
import { fullName } from '@/server/modules/users/mapper'
import type {
  CourseStatus,
  DashboardDto,
  InstructorDashboardDto,
  LearnerDashboardDto,
  OrganizationDashboardDto,
} from '@/shared/dto'
import { INSTRUCTOR_ROLES, LEARNER_ROLES } from '@/shared/roles'
import { average, dailySeries, daysAgo, lastDays, rate } from './time-series'

export async function getDashboard(actor: Actor): Promise<DashboardDto> {
  if (isLearnerRole(actor.role)) return learnerDashboard(actor)
  if (isInstructorRole(actor.role)) return instructorDashboard(actor)
  if (isManagerRole(actor.role)) return organizationDashboard(actor, requireManagerDepartment(actor))
  return organizationDashboard(actor, null)
}

async function nextLessonFor(userId: string, courseId: string): Promise<string | null> {
  const [sections, lessons] = await Promise.all([
    db.section.findMany({ where: { courseId }, select: { id: true, order: true } }),
    db.lesson.findMany({
      where: { courseId },
      select: { id: true, order: true, sectionId: true, progress: { where: { userId }, select: { isCompleted: true } } },
    }),
  ])
  const ordered = orderLessons(sections, lessons)
  return (ordered.find((lesson) => !lesson.progress[0]?.isCompleted) ?? ordered[0])?.id ?? null
}

async function learnerDashboard(actor: Actor): Promise<LearnerDashboardDto> {
  const days = lastDays(14)
  const [enrollments, certificates, attempts, completedLessons, recommended] = await Promise.all([
    db.enrollment.findMany({ where: { userId: actor.id, status: { not: 'dropped' } }, include: { course: { include: courseCardInclude(actor.id) } } }),
    db.certificate.findMany({ where: { userId: actor.id, status: 'active' }, include: { course: { select: { title: true } } }, orderBy: { issuedAt: 'desc' } }),
    db.quizAttempt.findMany({
      where: { userId: actor.id, status: 'graded' },
      include: { quiz: { select: { title: true } } },
      orderBy: { submittedAt: 'desc' },
      take: 5,
    }),
    db.lessonProgress.findMany({
      where: { userId: actor.id, isCompleted: true },
      select: { completedAt: true, updatedAt: true, lesson: { select: { courseId: true, durationMin: true } } },
    }),
    db.course.findMany({
      where: { status: 'published', enrollments: { none: { userId: actor.id } } },
      include: courseCardInclude(actor.id),
      orderBy: [{ isMandatory: 'desc' }, { enrollments: { _count: 'desc' } }],
      take: 4,
    }),
  ])

  // "Continue learning": active courses ordered by the most recent lesson activity.
  const lastActivity = new Map<string, number>()
  for (const progress of completedLessons) {
    const at = (progress.completedAt ?? progress.updatedAt).getTime()
    lastActivity.set(progress.lesson.courseId, Math.max(lastActivity.get(progress.lesson.courseId) ?? 0, at))
  }
  const active = enrollments
    .filter((enrollment) => enrollment.status === 'active')
    .sort((a, b) => (lastActivity.get(b.courseId) ?? b.startedAt.getTime()) - (lastActivity.get(a.courseId) ?? a.startedAt.getTime()))
    .slice(0, 4)
  const continueLearning = await Promise.all(
    active.map(async (enrollment) => ({ ...toCourseCard(enrollment.course, actor), nextLessonId: await nextLessonFor(actor.id, enrollment.courseId) }))
  )

  const now = new Date()
  return {
    kind: 'learner',
    stats: {
      enrolled: enrollments.length,
      inProgress: enrollments.filter((enrollment) => enrollment.status === 'active').length,
      completed: enrollments.filter((enrollment) => enrollment.status === 'completed').length,
      certificates: certificates.length,
      averageProgress: average(enrollments.map((enrollment) => enrollment.progress)),
      studyMinutes: completedLessons.reduce((total, progress) => total + progress.lesson.durationMin, 0),
    },
    continueLearning,
    deadlines: enrollments
      .filter((enrollment) => enrollment.status === 'active' && enrollment.deadlineAt && enrollment.deadlineAt > daysAgo(1, now))
      .sort((a, b) => a.deadlineAt!.getTime() - b.deadlineAt!.getTime())
      .slice(0, 5)
      .map((enrollment) => ({
        courseId: enrollment.courseId,
        title: enrollment.course.title,
        deadlineAt: enrollment.deadlineAt!.toISOString(),
        progress: enrollment.progress,
      })),
    recentResults: attempts.map((attempt) => ({
      attemptId: attempt.id,
      quizTitle: attempt.quiz.title,
      percentage: attempt.percentage,
      passed: attempt.passed,
      submittedAt: (attempt.submittedAt ?? attempt.startedAt).toISOString(),
    })),
    certificates: certificates.slice(0, 3).map((certificate) => ({
      id: certificate.id,
      certNumber: certificate.certNumber,
      courseTitle: certificate.course.title,
      issuedAt: certificate.issuedAt.toISOString(),
    })),
    activity: dailySeries(days, completedLessons.map((progress) => ({ at: progress.completedAt }))),
    recommended: recommended.map((course) => toCourseCard(course, actor)),
  }
}

async function instructorDashboard(actor: Actor): Promise<InstructorDashboardDto> {
  const ownCourse: Prisma.CourseWhereInput = { OR: [{ tutorId: actor.id }, { createdBy: actor.id }] }
  const days = lastDays(14)
  const [courses, attempts, completions, quizzes] = await Promise.all([
    db.course.findMany({
      where: { ...ownCourse, status: { not: 'archived' } },
      include: { enrollments: { select: { userId: true, status: true, progress: true } } },
      orderBy: { updatedAt: 'desc' },
    }),
    db.quizAttempt.findMany({
      where: { status: 'graded', quiz: { OR: [{ createdBy: actor.id }, { course: ownCourse }] } },
      include: { quiz: { select: { title: true } }, user: { select: { firstName: true, lastName: true } } },
      orderBy: { submittedAt: 'desc' },
      take: 200,
    }),
    db.lessonProgress.findMany({
      where: { isCompleted: true, completedAt: { gte: daysAgo(14) }, lesson: { course: ownCourse } },
      select: { completedAt: true },
    }),
    db.quiz.count({ where: { status: { not: 'archived' }, OR: [{ createdBy: actor.id }, { course: ownCourse }] } }),
  ])

  const enrollments = courses.flatMap((course) => course.enrollments)
  return {
    kind: 'instructor',
    stats: {
      courses: courses.length,
      publishedCourses: courses.filter((course) => course.status === 'published').length,
      learners: new Set(enrollments.map((enrollment) => enrollment.userId)).size,
      enrollments: enrollments.length,
      completionRate: rate(enrollments.filter((enrollment) => enrollment.status === 'completed').length, enrollments.length),
      averageScore: average(attempts.map((attempt) => attempt.percentage)),
      quizzes,
    },
    courses: courses.slice(0, 8).map((course) => ({
      id: course.id,
      title: course.title,
      status: course.status as CourseStatus,
      enrollments: course.enrollments.length,
      completionRate: rate(course.enrollments.filter((enrollment) => enrollment.status === 'completed').length, course.enrollments.length),
      averageProgress: average(course.enrollments.map((enrollment) => enrollment.progress)),
    })),
    recentAttempts: attempts.slice(0, 6).map((attempt) => ({
      attemptId: attempt.id,
      learnerName: `${attempt.user.lastName} ${attempt.user.firstName}`,
      quizTitle: attempt.quiz.title,
      percentage: attempt.percentage,
      passed: attempt.passed,
      submittedAt: (attempt.submittedAt ?? attempt.startedAt).toISOString(),
    })),
    activity: dailySeries(days, completions.map((progress) => ({ at: progress.completedAt }))),
  }
}

async function organizationDashboard(actor: Actor, department: string | null): Promise<OrganizationDashboardDto> {
  const learnerWhere: Prisma.UserWhereInput = { role: { in: [...LEARNER_ROLES] }, isActive: true, ...(department ? { department } : {}) }
  const userScope: Prisma.UserWhereInput = department ? { department } : {}
  const days = lastDays(30)

  const [learners, instructors, publishedCourses, enrollments, certificates, attempts, logins, resources, recentCertificates] = await Promise.all([
    db.user.findMany({ where: learnerWhere, select: { id: true, department: true } }),
    db.user.count({ where: { role: { in: [...INSTRUCTOR_ROLES] }, isActive: true } }),
    db.course.count({ where: { status: 'published' } }),
    db.enrollment.findMany({
      where: { user: learnerWhere },
      select: { userId: true, status: true, courseId: true, course: { select: { title: true, category: { select: { name: true } } } } },
    }),
    db.certificate.count({ where: { status: 'active', user: userScope } }),
    db.quizAttempt.findMany({ where: { status: 'graded', user: userScope }, select: { percentage: true, passed: true } }),
    db.activityLog.findMany({
      where: { action: 'login', createdAt: { gte: daysAgo(30) }, user: userScope },
      select: { userId: true, createdAt: true },
    }),
    db.libraryResource.count({ where: { status: 'active' } }),
    db.certificate.findMany({
      where: { status: 'active', user: userScope },
      include: { user: { select: { firstName: true, lastName: true, middleName: true } }, course: { select: { title: true } } },
      orderBy: { issuedAt: 'desc' },
      take: 6,
    }),
  ])

  const byCategory = new Map<string, number>()
  const byCourse = new Map<string, { title: string; enrollments: number; completed: number }>()
  for (const enrollment of enrollments) {
    const category = enrollment.course.category?.name ?? '—'
    byCategory.set(category, (byCategory.get(category) ?? 0) + 1)
    const course = byCourse.get(enrollment.courseId) ?? { title: enrollment.course.title, enrollments: 0, completed: 0 }
    course.enrollments += 1
    if (enrollment.status === 'completed') course.completed += 1
    byCourse.set(enrollment.courseId, course)
  }

  const departmentOf = new Map(learners.map((learner) => [learner.id, learner.department ?? '—']))
  const byDepartment = new Map<string, { learners: Set<string>; enrollments: number; completed: number }>()
  for (const learner of learners) {
    const key = learner.department ?? '—'
    const entry = byDepartment.get(key) ?? { learners: new Set(), enrollments: 0, completed: 0 }
    entry.learners.add(learner.id)
    byDepartment.set(key, entry)
  }
  for (const enrollment of enrollments) {
    const entry = byDepartment.get(departmentOf.get(enrollment.userId) ?? '—')
    if (!entry) continue
    entry.enrollments += 1
    if (enrollment.status === 'completed') entry.completed += 1
  }

  return {
    kind: 'organization',
    scope: { department },
    stats: {
      learners: learners.length,
      instructors,
      publishedCourses,
      enrollments: enrollments.length,
      completionRate: rate(enrollments.filter((enrollment) => enrollment.status === 'completed').length, enrollments.length),
      certificates,
      passRate: rate(attempts.filter((attempt) => attempt.passed).length, attempts.length),
      averageScore: average(attempts.map((attempt) => attempt.percentage)),
      activeUsers30d: new Set(logins.map((login) => login.userId)).size,
      resources,
    },
    activity: dailySeries(days, logins.map((login) => ({ at: login.createdAt, key: login.userId })), true),
    enrollmentsByCategory: [...byCategory.entries()]
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8),
    topCourses: [...byCourse.entries()]
      .map(([id, course]) => ({ id, title: course.title, enrollments: course.enrollments, completionRate: rate(course.completed, course.enrollments) }))
      .sort((a, b) => b.enrollments - a.enrollments)
      .slice(0, 6),
    recentCertificates: recentCertificates.map((certificate) => ({
      id: certificate.id,
      recipientName: fullName(certificate.user),
      courseTitle: certificate.course.title,
      issuedAt: certificate.issuedAt.toISOString(),
    })),
    departments: hasPermission(actor.role, PERMISSIONS.REPORTS_VIEW_ALL) || department
      ? [...byDepartment.entries()]
          .map(([name, entry]) => ({ name, learners: entry.learners.size, completionRate: rate(entry.completed, entry.enrollments) }))
          .sort((a, b) => b.learners - a.learners)
      : [],
  }
}
