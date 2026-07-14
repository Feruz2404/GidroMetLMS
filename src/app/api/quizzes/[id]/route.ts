import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser, ok, err, logActivity, getClientIp } from '@/lib/auth'
import { hasPermission, isInstructorRole, isLearnerRole, PERMISSIONS } from '@/server/auth/permissions'

// GET /api/quizzes/[id] — quiz detail with questions + options
// CRITICAL: strip isCorrect from options for students (don't reveal answers before submission)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser(req)
    if (!user) return err(401, 'Avtorizatsiya talab qilinadi')

    const { id } = await params

    const quiz = await db.quiz.findUnique({
      where: { id },
      include: {
        course: { select: { id: true, title: true } },
        questions: {
          orderBy: { order: 'asc' },
          include: { options: { orderBy: { order: 'asc' } } },
        },
        _count: { select: { questions: true, attempts: true } },
        ...(isLearnerRole(user.role)
          ? {
              attempts: {
                where: { userId: user.id },
                orderBy: { startedAt: 'desc' },
                select: {
                  id: true,
                  status: true,
                  score: true,
                  maxScore: true,
                  percentage: true,
                  passed: true,
                  startedAt: true,
                  submittedAt: true,
                  timeSpentSec: true,
                },
              },
            }
          : {}),
      },
    })

    if (!quiz) return err(404, 'Test topilmadi')

    // Visibility: students only see published
    if (isLearnerRole(user.role) && quiz.status !== 'published') {
      return err(404, 'Test topilmadi')
    }
    // Tutors can only see own non-published
    if (
      isInstructorRole(user.role) &&
      quiz.status !== 'published' &&
      quiz.createdBy !== user.id
    ) {
      return err(403, 'Ruxsat yo\'q')
    }

    const { attempts, ...rest } = quiz as typeof quiz & {
      attempts?: Array<{
        id: string
        status: string
        score: number
        maxScore: number
        percentage: number
        passed: boolean
        startedAt: Date
        submittedAt: Date | null
        timeSpentSec: number
      }>
    }

    // Students: check maxAttempts (in_progress + graded all count toward limit)
    let maxAttemptsExceeded = false
    let gradedCount = 0
    if (isLearnerRole(user.role) && attempts) {
      gradedCount = attempts.filter(
        (a) => a.status === 'graded' || a.status === 'submitted' || a.status === 'in_progress'
      ).length
      maxAttemptsExceeded = gradedCount >= quiz.maxAttempts
    }

    // SECURITY: For students, strip isCorrect from options
    const isStaff = hasPermission(user.role, PERMISSIONS.ASSESSMENTS_MANAGE)
    const questions = quiz.questions.map((q) => ({
      id: q.id,
      type: q.type,
      text: q.text,
      points: q.points,
      explanation: isStaff ? q.explanation : null,
      order: q.order,
      options: q.options.map((o) =>
        isStaff
          ? { id: o.id, text: o.text, isCorrect: o.isCorrect, order: o.order }
          : { id: o.id, text: o.text, order: o.order }
      ),
    }))

    return ok({
      ...rest,
      questions,
      myAttempts: attempts ?? [],
      maxAttemptsExceeded,
      gradedAttempts: gradedCount,
    })
  } catch (e) {
    if (e instanceof Error && (e.message === 'UNAUTHORIZED' || e.message === 'FORBIDDEN')) {
      return err(e.message === 'FORBIDDEN' ? 403 : 401, e.message === 'FORBIDDEN' ? 'Ruxsat yo\'q' : 'Avtorizatsiya talab qilinadi')
    }
    console.error('GET /api/quizzes/[id] error:', e)
    return err(500, 'Server xatosi')
  }
}

// PATCH /api/quizzes/[id] — update quiz metadata (questions handled separately or via full replace)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser(req)
    if (!user) return err(401, 'Avtorizatsiya talab qilinadi')
    if (!hasPermission(user.role, PERMISSIONS.ASSESSMENTS_MANAGE)) return err(403, 'Ruxsat yo\'q')

    const { id } = await params
    const quiz = await db.quiz.findUnique({ where: { id } })
    if (!quiz) return err(404, 'Test topilmadi')

    if (isInstructorRole(user.role) && quiz.createdBy !== user.id) {
      return err(403, 'Faqat o\'z testingizni tahrirlay olasiz')
    }

    const body = await req.json()
    const allowed = [
      'title', 'description', 'courseId', 'lessonId',
      'timeLimitMin', 'passingScore', 'maxAttempts',
      'shuffleQuestions', 'showAnswers', 'status',
    ]

    const data: Record<string, unknown> = {}
    for (const key of allowed) {
      if (key in body) {
        const v = (body as Record<string, unknown>)[key]
        if (v === undefined) continue
        if (['timeLimitMin', 'passingScore', 'maxAttempts'].includes(key)) {
          data[key] = Number(v)
        } else if (['shuffleQuestions', 'showAnswers'].includes(key)) {
          data[key] = Boolean(v)
        } else if (v === null) {
          data[key] = null
        } else {
          data[key] = v
        }
      }
    }

    const updated = await db.quiz.update({
      where: { id },
      data,
      include: {
        course: { select: { id: true, title: true } },
        _count: { select: { questions: true, attempts: true } },
      },
    })

    await logActivity(user.id, 'update_quiz', 'quiz', id, { fields: Object.keys(data) }, getClientIp(req))

    return ok(updated)
  } catch (e) {
    if (e instanceof Error && (e.message === 'UNAUTHORIZED' || e.message === 'FORBIDDEN')) {
      return err(e.message === 'FORBIDDEN' ? 403 : 401, e.message === 'FORBIDDEN' ? 'Ruxsat yo\'q' : 'Avtorizatsiya talab qilinadi')
    }
    console.error('PATCH /api/quizzes/[id] error:', e)
    return err(500, 'Server xatosi')
  }
}

export const dynamic = 'force-dynamic'
