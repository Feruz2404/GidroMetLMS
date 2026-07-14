import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser, ok, err } from '@/lib/auth'
import type { Prisma } from '@prisma/client'
import { isAdminRole, isInstructorRole, isLearnerRole, isManagerRole } from '@/server/auth/permissions'

// GET /api/reports?type=...
export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)
    if (!user) return err(401, 'Avtorizatsiya talab qilinadi')
    if (isLearnerRole(user.role)) return err(403, 'Ruxsat yo\'q')
    const manager = isManagerRole(user.role)
    const instructor = isInstructorRole(user.role)
    if (manager && !user.department) return err(403, 'Department scope is not configured', undefined, 'DEPARTMENT_SCOPE_MISSING')

    const courseScope: Prisma.CourseWhereInput = instructor
      ? { OR: [{ tutorId: user.id }, { createdBy: user.id }] }
      : manager
        ? { enrollments: { some: { user: { department: user.department } } } }
        : {}
    const learnerScope: Prisma.UserWhereInput = manager
      ? { department: user.department }
      : instructor
        ? { enrollments: { some: { course: courseScope } } }
        : {}
    const enrollmentScope: Prisma.EnrollmentWhereInput = manager
      ? { user: { department: user.department } }
      : instructor
        ? { course: courseScope }
        : {}
    const attemptScope: Prisma.QuizAttemptWhereInput = manager
      ? { user: { department: user.department } }
      : instructor
        ? { quiz: { course: courseScope } }
        : {}
    const certificateScope: Prisma.CertificateWhereInput = manager
      ? { user: { department: user.department } }
      : instructor
        ? { course: courseScope }
        : {}

    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type') ?? 'overview'

    if (type === 'overview') {
      const totalStudents = await db.user.count({ where: { role: { in: ['student', 'learner'] }, isActive: true, ...learnerScope } })
      const totalTutors = instructor ? 1 : await db.user.count({ where: { role: { in: ['tutor', 'instructor'] }, isActive: true, ...(manager ? { department: user.department } : {}) } })
      const totalCourses = await db.course.count({ where: { status: 'published', ...courseScope } })
      const totalEnrollments = await db.enrollment.count({ where: enrollmentScope })
      const completedEnrollments = await db.enrollment.count({ where: { status: 'completed', ...enrollmentScope } })
      const totalCertificates = await db.certificate.count({ where: { status: 'active', ...certificateScope } })
      const totalResources = await db.libraryResource.count({ where: { status: 'active' } })
      const totalDownloads = await db.resourceDownload.count()
      const totalAttempts = await db.quizAttempt.count({ where: { status: 'graded', ...attemptScope } })
      const passedAttempts = await db.quizAttempt.count({ where: { status: 'graded', passed: true, ...attemptScope } })

      return ok({
        overview: {
          totalStudents,
          totalTutors,
          totalCourses,
          totalEnrollments,
          completedEnrollments,
          completionRate: totalEnrollments ? Math.round((completedEnrollments / totalEnrollments) * 100) : 0,
          totalCertificates,
          totalResources,
          totalDownloads,
          totalAttempts,
          passedAttempts,
          passRate: totalAttempts ? Math.round((passedAttempts / totalAttempts) * 100) : 0,
        },
      })
    }

    if (type === 'students') {
      const students = await db.user.findMany({
        where: { role: { in: ['student', 'learner'] }, ...learnerScope },
        include: {
          enrollments: { select: { id: true, progress: true, status: true, courseId: true, course: { select: { title: true } } } },
          certificates: { where: { status: 'active' }, select: { id: true, percentage: true, course: { select: { title: true } } } },
          quizAttempts: { where: { status: 'graded' }, select: { id: true, score: true, maxScore: true, percentage: true, passed: true } },
        },
        orderBy: { createdAt: 'desc' },
      })

      const rows = students.map((s) => ({
        id: s.id,
        name: `${s.firstName} ${s.lastName}${s.middleName ? ' ' + s.middleName : ''}`,
        email: s.email,
        department: s.department ?? '-',
        enrolledCourses: s.enrollments.length,
        completedCourses: s.enrollments.filter((e) => e.status === 'completed').length,
        avgProgress: s.enrollments.length ? Math.round(s.enrollments.reduce((a, e) => a + e.progress, 0) / s.enrollments.length) : 0,
        certificates: s.certificates.length,
        attempts: s.quizAttempts.length,
        passedAttempts: s.quizAttempts.filter((a) => a.passed).length,
        isActive: s.isActive,
        lastLoginAt: s.lastLoginAt,
      }))

      return ok({ students: rows, total: rows.length })
    }

    if (type === 'courses') {
      const courses = await db.course.findMany({
        where: { status: 'published', ...courseScope },
        include: {
          _count: { select: { enrollments: true, lessons: true } },
          enrollments: { where: manager ? enrollmentScope : undefined, select: { progress: true, status: true } },
          tutor: { select: { firstName: true, lastName: true } },
          category: { select: { name: true } },
        },
        orderBy: { createdAt: 'desc' },
      })

      const rows = courses.map((c) => {
        const enrolled = c.enrollments.length
        const completed = c.enrollments.filter((e) => e.status === 'completed').length
        const avgProgress = enrolled ? Math.round(c.enrollments.reduce((a, e) => a + e.progress, 0) / enrolled) : 0
        return {
          id: c.id,
          title: c.title,
          category: c.category?.name ?? '-',
          tutor: c.tutor ? `${c.tutor.firstName} ${c.tutor.lastName}` : '-',
          lessons: c._count.lessons,
          enrolled,
          completed,
          completionRate: enrolled ? Math.round((completed / enrolled) * 100) : 0,
          avgProgress,
          durationHours: c.durationHours,
          level: c.level,
        }
      })

      return ok({ courses: rows, total: rows.length })
    }

    if (type === 'quiz-results') {
      const attempts = await db.quizAttempt.findMany({
        where: { status: 'graded', ...attemptScope },
        include: {
          user: { select: { firstName: true, lastName: true, email: true } },
          quiz: { select: { title: true, course: { select: { title: true } } } },
        },
        orderBy: { submittedAt: 'desc' },
        take: 200,
      })

      const rows = attempts.map((a) => ({
        id: a.id,
        student: `${a.user.firstName} ${a.user.lastName}`,
        email: a.user.email,
        quiz: a.quiz.title,
        course: a.quiz.course?.title ?? '-',
        score: a.score,
        maxScore: a.maxScore,
        percentage: a.percentage,
        passed: a.passed,
        submittedAt: a.submittedAt,
        timeSpentSec: a.timeSpentSec,
      }))

      // Score distribution buckets
      const buckets = [0, 0, 0, 0, 0] // 0-20, 21-40, 41-60, 61-80, 81-100
      rows.forEach((r) => {
        const i = Math.min(4, Math.floor(r.percentage / 20))
        buckets[i]++
      })

      return ok({
        attempts: rows,
        total: rows.length,
        distribution: buckets.map((count, i) => ({
          range: `${i * 20}-${i * 20 + 20}%`,
          count,
        })),
      })
    }

    if (type === 'certificates') {
      const certs = await db.certificate.findMany({
        where: certificateScope,
        include: {
          user: { select: { firstName: true, lastName: true, email: true } },
          course: { select: { title: true } },
        },
        orderBy: { issuedAt: 'desc' },
        take: 200,
      })

      const rows = certs.map((c) => ({
        id: c.id,
        certNumber: c.certNumber,
        student: `${c.user.firstName} ${c.user.lastName}`,
        email: c.user.email,
        course: c.course.title,
        percentage: c.percentage,
        issuedAt: c.issuedAt,
        validUntil: c.validUntil,
        status: c.status,
      }))

      // Monthly counts (last 6 months)
      const monthly: Record<string, number> = {}
      for (let i = 5; i >= 0; i--) {
        const d = new Date()
        d.setMonth(d.getMonth() - i)
        monthly[`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`] = 0
      }
      certs.forEach((c) => {
        const d = new Date(c.issuedAt)
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        if (key in monthly) monthly[key]++
      })

      return ok({
        certificates: rows,
        total: rows.length,
        monthly: Object.entries(monthly).map(([month, count]) => ({ month, count })),
      })
    }

    if (type === 'library-usage') {
      const resources = await db.libraryResource.findMany({
        where: { status: 'active' },
        include: { _count: { select: { downloads: true, bookmarks: true } } },
        orderBy: { downloadCount: 'desc' },
        take: 50,
      })
      const rows = resources.map((r) => ({
        id: r.id,
        title: r.title,
        type: r.type,
        category: r.category ?? '-',
        author: r.author ?? '-',
        downloads: r.downloadCount,
        views: r.viewCount,
        bookmarks: r._count.bookmarks,
        fileType: r.fileType,
        fileSize: r.fileSize,
      }))
      return ok({ resources: rows, total: rows.length })
    }

    if (type === 'audit-log') {
      // The audit log exposes every user's actions and IP addresses — admin only.
      if (!isAdminRole(user.role)) return err(403, 'Ruxsat yo\'q')
      const logs = await db.activityLog.findMany({
        include: { user: { select: { firstName: true, lastName: true, email: true, role: true } } },
        orderBy: { createdAt: 'desc' },
        take: 200,
      })
      const rows = logs.map((l) => ({
        id: l.id,
        user: l.user ? `${l.user.firstName} ${l.user.lastName}` : 'Unknown',
        email: l.user?.email ?? '-',
        role: l.user?.role ?? '-',
        action: l.action,
        entity: l.entity,
        entityId: l.entityId,
        ipAddress: l.ipAddress,
        createdAt: l.createdAt,
      }))
      return ok({ logs: rows, total: rows.length })
    }

    return err(400, 'Noma\'lum hisobot turi')
  } catch (e) {
    if (e instanceof Error && (e.message === 'UNAUTHORIZED' || e.message === 'FORBIDDEN')) {
      return err(e.message === 'FORBIDDEN' ? 403 : 401, e.message === 'FORBIDDEN' ? 'Ruxsat yo\'q' : 'Avtorizatsiya talab qilinadi')
    }
    console.error('Reports error:', e)
    return err(500, 'Server xatosi')
  }
}

export const dynamic = 'force-dynamic'
