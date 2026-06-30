import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser, ok, err, logActivity, getClientIp } from '@/lib/auth'

// POST /api/courses/[id]/enroll — student self-enrolls
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser(req)
    if (!user) return err(401, 'Avtorizatsiya talab qilinadi')
    if (user.role !== 'student') return err(403, 'Faqat talabalar kursga yozila oladi')

    const { id } = await params

    const course = await db.course.findUnique({ where: { id } })
    if (!course) return err(404, 'Kurs topilmadi')
    if (course.status !== 'published') return err(403, 'Kurs hozircha ochiq emas')

    // Check if already enrolled
    const existing = await db.enrollment.findUnique({
      where: { courseId_userId: { courseId: id, userId: user.id } },
    })
    if (existing) {
      if (existing.status === 'dropped') {
        // Reactivate dropped enrollment
        const updated = await db.enrollment.update({
          where: { id: existing.id },
          data: { status: 'active', startedAt: new Date() },
        })
        return ok(updated)
      }
      return ok(existing)
    }

    const deadlineAt = course.validDays
      ? new Date(Date.now() + course.validDays * 24 * 60 * 60 * 1000)
      : null

    const enrollment = await db.enrollment.create({
      data: {
        courseId: id,
        userId: user.id,
        status: 'active',
        progress: 0,
        startedAt: new Date(),
        deadlineAt,
      },
    })

    await logActivity(user.id, 'enroll_course', 'course', id, { courseId: id }, getClientIp(req))

    // Send welcome notification
    await db.notification.create({
      data: {
        userId: user.id,
        type: 'success',
        title: 'Kursga yozildingiz',
        message: `"${course.title}" kursiga muvaffaqiyatli yozildingiz. O'qishni boshlang!`,
        link: `course-detail:${id}`,
      },
    })

    return ok(enrollment)
  } catch (e) {
    if (e instanceof Error && (e.message === 'UNAUTHORIZED' || e.message === 'FORBIDDEN')) {
      return err(e.message === 'FORBIDDEN' ? 403 : 401, e.message === 'FORBIDDEN' ? 'Ruxsat yo\'q' : 'Avtorizatsiya talab qilinadi')
    }
    console.error('POST /api/courses/[id]/enroll error:', e)
    return err(500, 'Server xatosi')
  }
}

export const dynamic = 'force-dynamic'
