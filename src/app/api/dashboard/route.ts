import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser, ok, err } from '@/lib/auth'
import { isInstructorRole, isLearnerRole, isManagerRole } from '@/server/auth/permissions'

// GET /api/dashboard — role-based stats
export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)
    if (!user) return err(401, 'Avtorizatsiya talab qilinadi')

    if (isLearnerRole(user.role)) {
      const enrollments = await db.enrollment.findMany({
        where: { userId: user.id },
        include: {
          course: {
            select: {
              id: true,
              title: true,
              slug: true,
              thumbnailUrl: true,
              durationHours: true,
              level: true,
              tutor: { select: { firstName: true, lastName: true } },
              category: { select: { name: true, icon: true } },
              _count: { select: { lessons: true } },
            },
          },
        },
        orderBy: { startedAt: 'desc' },
      })

      const certificates = await db.certificate.findMany({
        where: { userId: user.id, status: 'active' },
        include: { course: { select: { id: true, title: true } } },
        orderBy: { issuedAt: 'desc' },
      })

      const attempts = await db.quizAttempt.findMany({
        where: { userId: user.id },
        include: { quiz: { select: { id: true, title: true, courseId: true } } },
        orderBy: { startedAt: 'desc' },
        take: 5,
      })

      const notifications = await db.notification.count({
        where: { userId: user.id, isRead: false },
      })

      const completed = enrollments.filter((e) => e.status === 'completed').length
      const inProgress = enrollments.filter((e) => e.status === 'active').length
      const avgProgress = enrollments.length
        ? Math.round(enrollments.reduce((s, e) => s + e.progress, 0) / enrollments.length)
        : 0

      // Weekly activity (last 7 days lesson completions)
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      const recentProgress = await db.lessonProgress.findMany({
        where: { userId: user.id, completedAt: { gte: weekAgo } },
        select: { completedAt: true },
      })
      const activityMap: Record<string, number> = {}
      for (let i = 6; i >= 0; i--) {
        const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
        const key = d.toISOString().slice(0, 10)
        activityMap[key] = 0
      }
      recentProgress.forEach((p) => {
        if (p.completedAt) {
          const key = p.completedAt.toISOString().slice(0, 10)
          if (key in activityMap) activityMap[key]++
        }
      })

      return ok({
        role: user.role,
        stats: {
          enrolled: enrollments.length,
          completed,
          inProgress,
          certificates: certificates.length,
          avgProgress,
          unreadNotifications: notifications,
        },
        enrollments: enrollments.slice(0, 4),
        certificates: certificates.slice(0, 3),
        recentAttempts: attempts,
        weeklyActivity: Object.entries(activityMap).map(([date, count]) => ({ date, count })),
      })
    }

    if (isInstructorRole(user.role)) {
      const courses = await db.course.findMany({
        where: { tutorId: user.id },
        include: {
          _count: { select: { enrollments: true, lessons: true } },
          category: { select: { name: true } },
        },
      })

      const courseIds = courses.map((c) => c.id)
      const enrollments = await db.enrollment.findMany({
        where: { courseId: { in: courseIds } },
        select: { id: true, userId: true, progress: true, status: true, startedAt: true },
      })

      const attempts = await db.quizAttempt.findMany({
        where: { quiz: { courseId: { in: courseIds } } },
        select: { id: true, score: true, maxScore: true, passed: true, submittedAt: true },
      })

      const passed = attempts.filter((a) => a.passed).length
      const avgScore = attempts.length
        ? Math.round(attempts.reduce((s, a) => s + (a.maxScore ? (a.score / a.maxScore) * 100 : 0), 0) / attempts.length)
        : 0

      return ok({
        role: user.role,
        stats: {
          courses: courses.length,
          students: new Set(enrollments.map((e) => e.userId)).size,
          totalEnrollments: enrollments.length,
          attempts: attempts.length,
          passed,
          avgScore,
        },
        courses: courses.slice(0, 5),
        recentAttempts: [],
      })
    }

    if (isManagerRole(user.role)) {
      if (!user.department) return err(403, 'Department scope is not configured', undefined, 'DEPARTMENT_SCOPE_MISSING')
      const employees = await db.user.findMany({
        where: { department: user.department, role: { in: ['learner', 'student'] }, isActive: true },
        select: { id: true },
      })
      const employeeIds = employees.map((employee) => employee.id)
      const enrollments = await db.enrollment.findMany({
        where: { userId: { in: employeeIds } },
        select: { userId: true, courseId: true, status: true },
      })
      const attempts = await db.quizAttempt.findMany({
        where: { userId: { in: employeeIds }, status: 'graded' },
        select: { passed: true, percentage: true },
      })
      const courseIds = [...new Set(enrollments.map((enrollment) => enrollment.courseId))]
      const courses = await db.course.findMany({
        where: { id: { in: courseIds } },
        select: { id: true, title: true, _count: { select: { lessons: true } } },
      })
      const enrollmentCounts = new Map<string, number>()
      enrollments.forEach((enrollment) => enrollmentCounts.set(enrollment.courseId, (enrollmentCounts.get(enrollment.courseId) ?? 0) + 1))
      const totalCertificates = await db.certificate.count({ where: { userId: { in: employeeIds }, status: 'active' } })
      const recentCertificates = await db.certificate.findMany({
        where: { userId: { in: employeeIds } },
        take: 5,
        orderBy: { issuedAt: 'desc' },
        include: {
          user: { select: { firstName: true, lastName: true } },
          course: { select: { title: true } },
        },
      })
      const passed = attempts.filter((attempt) => attempt.passed).length
      const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      const activeUsers = await db.activityLog.findMany({
        where: { userId: { in: employeeIds }, action: 'login', createdAt: { gte: monthAgo } },
        select: { userId: true },
        distinct: ['userId'],
      })

      return ok({
        role: user.role,
        stats: {
          totalStudents: employees.length,
          totalTutors: 0,
          totalAdmins: 0,
          totalCourses: courseIds.length,
          totalCertificates,
          totalResources: 0,
          totalEnrollments: enrollments.length,
          activeUsers: activeUsers.length,
          passRate: attempts.length ? Math.round((passed / attempts.length) * 100) : 0,
          avgScore: attempts.length ? Math.round(attempts.reduce((sum, attempt) => sum + attempt.percentage, 0) / attempts.length) : 0,
        },
        topCourses: courses
          .map((course) => ({ ...course, _count: { lessons: course._count.lessons, enrollments: enrollmentCounts.get(course.id) ?? 0 } }))
          .sort((a, b) => b._count.enrollments - a._count.enrollments)
          .slice(0, 5),
        recentCertificates,
      })
    }

    // Organization-wide administrator view.
    const totalStudents = await db.user.count({ where: { role: { in: ['student', 'learner'] } } })
    const totalTutors = await db.user.count({ where: { role: { in: ['tutor', 'instructor'] } } })
    const totalAdmins = await db.user.count({ where: { role: { in: ['admin', 'administrator', 'super_admin'] } } })
    const totalCourses = await db.course.count({ where: { status: 'published' } })
    const totalCertificates = await db.certificate.count({ where: { status: 'active' } })
    const totalResources = await db.libraryResource.count({ where: { status: 'active' } })
    const totalEnrollments = await db.enrollment.count()

    const attempts = await db.quizAttempt.findMany({
      where: { status: 'graded' },
      select: { passed: true, percentage: true },
    })
    const passed = attempts.filter((a) => a.passed).length
    const avgScore = attempts.length
      ? Math.round(attempts.reduce((s, a) => s + a.percentage, 0) / attempts.length)
      : 0

    // 30-day active users
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const activeUsers = await db.activityLog.findMany({
      where: { createdAt: { gte: monthAgo }, action: 'login' },
      select: { userId: true, createdAt: true },
      distinct: ['userId'],
    })

    // Daily activity for last 14 days
    const dailyActive: Record<string, number> = {}
    for (let i = 13; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
      dailyActive[d.toISOString().slice(0, 10)] = 0
    }
    const logs = await db.activityLog.findMany({
      where: { createdAt: { gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) }, action: 'login' },
      select: { createdAt: true, userId: true },
    })
    const seenPerDay: Record<string, Set<string>> = {}
    logs.forEach((l) => {
      const key = l.createdAt.toISOString().slice(0, 10)
      if (key in dailyActive) {
        if (!seenPerDay[key]) seenPerDay[key] = new Set()
        seenPerDay[key].add(l.userId)
      }
    })
    Object.entries(seenPerDay).forEach(([k, v]) => {
      dailyActive[k] = v.size
    })

    const topCourses = await db.course.findMany({
      take: 5,
      orderBy: { enrollments: { _count: 'desc' } },
      include: { _count: { select: { enrollments: true, lessons: true } } },
    })

    const recentCertificates = await db.certificate.findMany({
      take: 5,
      orderBy: { issuedAt: 'desc' },
      include: {
        user: { select: { firstName: true, lastName: true } },
        course: { select: { title: true } },
      },
    })

    return ok({
      role: user.role,
      stats: {
        totalStudents,
        totalTutors,
        totalAdmins,
        totalCourses,
        totalCertificates,
        totalResources,
        totalEnrollments,
        activeUsers: activeUsers.length,
        passRate: attempts.length ? Math.round((passed / attempts.length) * 100) : 0,
        avgScore,
      },
      dailyActive: Object.entries(dailyActive).map(([date, count]) => ({ date, count })),
      topCourses,
      recentCertificates,
    })
  } catch (e) {
    if (e instanceof Error && (e.message === 'UNAUTHORIZED' || e.message === 'FORBIDDEN')) {
      return err(e.message === 'FORBIDDEN' ? 403 : 401, e.message === 'FORBIDDEN' ? 'Ruxsat yo\'q' : 'Avtorizatsiya talab qilinadi')
    }
    console.error('Dashboard error:', e)
    return err(500, 'Server xatosi')
  }
}

export const dynamic = 'force-dynamic'
