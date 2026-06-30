import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser, ok, err, logActivity } from '@/lib/auth'

// POST /api/courses/[id]/progress — upsert lesson progress + recalculate course progress
// Body: { lessonId, isCompleted, watchTimeSec, lastPosition }
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser(req)
    if (!user) return err(401, 'Avtorizatsiya talab qilinadi')
    if (user.role !== 'student') return err(403, 'Faqat talabalar progressni yangilay oladi')

    const { id } = await params
    const body = await req.json()
    const { lessonId, isCompleted, watchTimeSec, lastPosition } = body as {
      lessonId?: string
      isCompleted?: boolean
      watchTimeSec?: number
      lastPosition?: number
    }

    if (!lessonId) return err(400, 'lessonId majburiy')

    // Verify enrollment exists
    const enrollment = await db.enrollment.findUnique({
      where: { courseId_userId: { courseId: id, userId: user.id } },
    })
    if (!enrollment) return err(403, 'Avval kursga yoziling')

    // Verify lesson belongs to course
    const lesson = await db.lesson.findFirst({ where: { id: lessonId, courseId: id } })
    if (!lesson) return err(404, 'Dars topilmadi')

    // Upsert lesson progress
    const existing = await db.lessonProgress.findUnique({
      where: { lessonId_userId: { lessonId, userId: user.id } },
    })

    const nowCompleted = isCompleted ?? existing?.isCompleted ?? false
    const newWatchTime = Math.max(existing?.watchTimeSec ?? 0, Number(watchTimeSec) || 0)
    const newPosition = Math.max(existing?.lastPosition ?? 0, Number(lastPosition) || 0)

    const progress = await db.lessonProgress.upsert({
      where: { lessonId_userId: { lessonId, userId: user.id } },
      update: {
        isCompleted: nowCompleted,
        watchTimeSec: newWatchTime,
        lastPosition: newPosition,
        completedAt: nowCompleted ? (existing?.completedAt ?? new Date()) : null,
      },
      create: {
        lessonId,
        userId: user.id,
        isCompleted: nowCompleted,
        watchTimeSec: newWatchTime,
        lastPosition: newPosition,
        completedAt: nowCompleted ? new Date() : null,
      },
    })

    // Recalculate course progress (completed lessons / total lessons * 100)
    const totalLessons = await db.lesson.count({ where: { courseId: id } })
    const completedLessons = await db.lessonProgress.count({
      where: { userId: user.id, lesson: { courseId: id }, isCompleted: true },
    })
    const newProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

    // Update enrollment
    const isNowComplete = newProgress >= 100
    const updatedEnrollment = await db.enrollment.update({
      where: { id: enrollment.id },
      data: {
        progress: newProgress,
        status: isNowComplete ? 'completed' : 'active',
        completedAt: isNowComplete && !enrollment.completedAt ? new Date() : enrollment.completedAt,
      },
    })

    // If just completed, send notification
    if (isNowComplete && !enrollment.completedAt) {
      const course = await db.course.findUnique({ where: { id }, select: { title: true } })
      if (course) {
        await db.notification.create({
          data: {
            userId: user.id,
            type: 'success',
            title: 'Kurs yakunlandi! 🎉',
            message: `"${course.title}" kursini muvaffaqiyatli yakunladingiz. Endi yakuniy testni topshirishingiz mumkin.`,
            link: `course-detail:${id}`,
          },
        })
        await logActivity(user.id, 'complete_course', 'course', id, { progress: 100 })
      }
    } else if (nowCompleted && !existing?.isCompleted) {
      await logActivity(user.id, 'complete_lesson', 'lesson', lessonId, { courseId: id })
    }

    return ok({
      lessonProgress: progress,
      courseProgress: newProgress,
      completedLessons,
      totalLessons,
      enrollmentStatus: updatedEnrollment.status,
    })
  } catch (e) {
    if (e instanceof Error && (e.message === 'UNAUTHORIZED' || e.message === 'FORBIDDEN')) {
      return err(e.message === 'FORBIDDEN' ? 403 : 401, e.message === 'FORBIDDEN' ? 'Ruxsat yo\'q' : 'Avtorizatsiya talab qilinadi')
    }
    console.error('POST /api/courses/[id]/progress error:', e)
    return err(500, 'Server xatosi')
  }
}

export const dynamic = 'force-dynamic'
