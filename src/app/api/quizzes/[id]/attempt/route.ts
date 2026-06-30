import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser, ok, err, logActivity, getClientIp } from '@/lib/auth'

// POST /api/quizzes/[id]/attempt — start a new attempt
// - Checks quiz is published (for students) and maxAttempts not exceeded
// - Creates QuizAttempt with status "in_progress"
// - Returns attempt id + questions (with options, isCorrect stripped) + timeLimitMin + startedAt
export async function POST(
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
        questions: {
          orderBy: { order: 'asc' },
          include: { options: { orderBy: { order: 'asc' } } },
        },
        ...(user.role === 'student'
          ? {
              attempts: {
                where: { userId: user.id },
                select: { id: true, status: true, startedAt: true },
              },
            }
          : {}),
      },
    })

    if (!quiz) return err(404, 'Test topilmadi')

    // Visibility
    if (user.role === 'student' && quiz.status !== 'published') {
      return err(404, 'Test topilmadi')
    }
    if (user.role === 'tutor' && quiz.status !== 'published' && quiz.createdBy !== user.id) {
      return err(403, 'Ruxsat yo\'q')
    }

    // Only students take quizzes (tutors/admins can preview but the UI shouldn't really do that)
    // For demo, allow students only.
    if (user.role !== 'student') {
      return err(403, 'Faqat talabalar test topshira oladi')
    }

    if (quiz.questions.length === 0) {
      return err(400, 'Testda savollar mavjud emas')
    }

    // Check maxAttempts (graded/submitted/in_progress all count toward limit,
    // since an in_progress attempt will be auto-failed if a new one is started)
    const attemptsArr = (quiz.attempts as Array<{ id: string; status: string }>) ?? []
    const usedAttempts = attemptsArr.filter(
      (a) => a.status === 'graded' || a.status === 'submitted' || a.status === 'in_progress'
    ).length
    if (usedAttempts >= quiz.maxAttempts) {
      return err(403, 'Urinishlar soni tugadi')
    }

    // Optional: prevent multiple in_progress attempts (force-fail previous in-progress)
    const inProgress = attemptsArr.find((a) => a.status === 'in_progress')
    if (inProgress) {
      // mark the previous as submitted/graded with zero score (auto-submit empty)
      await db.quizAttempt.update({
        where: { id: inProgress.id },
        data: {
          status: 'graded',
          submittedAt: new Date(),
          timeSpentSec: 0,
          score: 0,
          percentage: 0,
          passed: false,
        },
      })
    }

    const attempt = await db.quizAttempt.create({
      data: {
        quizId: quiz.id,
        userId: user.id,
        status: 'in_progress',
        startedAt: new Date(),
      },
    })

    await logActivity(
      user.id,
      'start_quiz_attempt',
      'quiz',
      quiz.id,
      { attemptId: attempt.id, title: quiz.title },
      getClientIp(req)
    )

    // Shuffle questions if enabled
    let qs = quiz.questions
    if (quiz.shuffleQuestions) {
      qs = [...quiz.questions].sort(() => Math.random() - 0.5)
    }

    // Strip isCorrect from options for student consumption
    const questions = qs.map((q) => ({
      id: q.id,
      type: q.type,
      text: q.text,
      points: q.points,
      order: q.order,
      options: q.options.map((o) => ({ id: o.id, text: o.text, order: o.order })),
    }))

    return ok({
      attemptId: attempt.id,
      quiz: {
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        timeLimitMin: quiz.timeLimitMin,
        passingScore: quiz.passingScore,
        showAnswers: quiz.showAnswers,
        shuffleQuestions: quiz.shuffleQuestions,
      },
      questions,
      startedAt: attempt.startedAt,
      attemptsRemaining: Math.max(0, quiz.maxAttempts - usedAttempts - 1),
    })
  } catch (e) {
    if (e instanceof Error && (e.message === 'UNAUTHORIZED' || e.message === 'FORBIDDEN')) {
      return err(e.message === 'FORBIDDEN' ? 403 : 401, e.message === 'FORBIDDEN' ? 'Ruxsat yo\'q' : 'Avtorizatsiya talab qilinadi')
    }
    console.error('POST /api/quizzes/[id]/attempt error:', e)
    return err(500, 'Server xatosi')
  }
}

export const dynamic = 'force-dynamic'
