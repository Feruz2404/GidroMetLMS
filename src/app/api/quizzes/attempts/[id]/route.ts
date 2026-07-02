import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser, ok, err, logActivity, getClientIp } from '@/lib/auth'

// GET /api/quizzes/attempts/[id] — get attempt with answers for review
// Only returns full answers (correct options) if quiz.showAnswers is true OR user is tutor/admin
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser(req)
    if (!user) return err(401, 'Avtorizatsiya talab qilinadi')

    const { id } = await params

    const attempt = await db.quizAttempt.findUnique({
      where: { id },
      include: {
        quiz: {
          select: {
            id: true,
            title: true,
            description: true,
            timeLimitMin: true,
            passingScore: true,
            showAnswers: true,
            createdBy: true,
            course: { select: { id: true, title: true } },
          },
        },
        answers: {
          include: {
            question: {
              include: { options: { orderBy: { order: 'asc' } } },
            },
          },
        },
      },
    })

    if (!attempt) return err(404, 'Urinish topilmadi')

    // Ownership: student can only see own attempt; tutor/admin can see any
    const isOwner = attempt.userId === user.id
    const isStaff = user.role === 'tutor' || user.role === 'admin'
    if (!isOwner && !isStaff) {
      return err(403, 'Ruxsat yo\'q')
    }

    const canSeeAnswers = attempt.quiz.showAnswers || isStaff

    const answers = attempt.answers.map((a) => {
      const correctOptions = a.question.options
        .filter((o) => o.isCorrect)
        .map((o) => ({ id: o.id, text: o.text }))
      const selectedOptions: string[] = a.selectedOptions
        ? (() => {
            try {
              const parsed = JSON.parse(a.selectedOptions)
              return Array.isArray(parsed) ? parsed : []
            } catch {
              return []
            }
          })()
        : []

      // Map selected option ids to text
      const selectedTexts = a.question.options
        .filter((o) => selectedOptions.includes(o.id))
        .map((o) => ({ id: o.id, text: o.text }))

      return {
        id: a.id,
        questionId: a.questionId,
        questionType: a.question.type,
        questionText: a.question.text,
        points: a.question.points,
        explanation: canSeeAnswers ? a.question.explanation : null,
        selectedOptions: selectedTexts,
        textAnswer: a.textAnswer,
        isCorrect: a.isCorrect,
        pointsAwarded: a.pointsAwarded,
        correctOptions: canSeeAnswers ? correctOptions : [],
        allOptions: canSeeAnswers
          ? a.question.options.map((o) => ({ id: o.id, text: o.text, isCorrect: o.isCorrect, order: o.order }))
          : a.question.options.map((o) => ({ id: o.id, text: o.text, order: o.order })),
      }
    })

    return ok({
      id: attempt.id,
      quizId: attempt.quizId,
      status: attempt.status,
      score: attempt.score,
      maxScore: attempt.maxScore,
      percentage: attempt.percentage,
      passed: attempt.passed,
      startedAt: attempt.startedAt,
      submittedAt: attempt.submittedAt,
      timeSpentSec: attempt.timeSpentSec,
      quiz: attempt.quiz,
      canSeeAnswers,
      answers,
    })
  } catch (e) {
    if (e instanceof Error && (e.message === 'UNAUTHORIZED' || e.message === 'FORBIDDEN')) {
      return err(e.message === 'FORBIDDEN' ? 403 : 401, e.message === 'FORBIDDEN' ? 'Ruxsat yo\'q' : 'Avtorizatsiya talab qilinadi')
    }
    console.error('GET /api/quizzes/attempts/[id] error:', e)
    return err(500, 'Server xatosi')
  }
}

// POST /api/quizzes/attempts/[id] — submit answers and grade
// Body: { answers: [{ questionId, selectedOptions?: string[], textAnswer?: string }] }
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser(req)
    if (!user) return err(401, 'Avtorizatsiya talab qilinadi')

    const { id } = await params

    const attempt = await db.quizAttempt.findUnique({
      where: { id },
      include: {
        quiz: {
          select: {
            id: true,
            title: true,
            passingScore: true,
            showAnswers: true,
            courseId: true,
            createdBy: true,
          },
        },
        answers: { select: { id: true, questionId: true } },
      },
    })

    if (!attempt) return err(404, 'Urinish topilmadi')

    // Only the owner can submit
    if (attempt.userId !== user.id) {
      return err(403, 'Ruxsat yo\'q')
    }
    // Cannot submit twice
    if (attempt.status === 'graded' || attempt.status === 'submitted') {
      return err(400, 'Bu urinish allaqachon yakunlangan')
    }

    const body = await req.json()
    const answersInput = Array.isArray((body as Record<string, unknown>)?.answers)
      ? ((body as Record<string, unknown>).answers as Array<Record<string, unknown>>)
      : []

    // Load questions for this quiz (with options, correct flags)
    const questions = await db.question.findMany({
      where: { quizId: attempt.quizId },
      include: { options: true },
    })

    // Build submitted answer map (questionId → answer)
    const submittedMap = new Map<string, { selectedOptions: string[]; textAnswer: string | null }>()
    for (const a of answersInput) {
      const qid = String(a.questionId ?? '')
      if (!qid) continue
      const selRaw = a.selectedOptions
      const selectedOptions = Array.isArray(selRaw)
        ? (selRaw as unknown[]).map((s) => String(s)).filter(Boolean)
        : []
      const textAnswer =
        typeof a.textAnswer === 'string' && a.textAnswer.trim().length > 0
          ? a.textAnswer.trim()
          : null
      submittedMap.set(qid, { selectedOptions, textAnswer })
    }

    // Grade each question
    let score = 0
    let maxScore = 0
    const answerRecords: Array<{
      questionId: string
      selectedOptions: string | null
      textAnswer: string | null
      isCorrect: boolean
      pointsAwarded: number
    }> = []

    for (const q of questions) {
      maxScore += q.points
      const submitted = submittedMap.get(q.id) ?? { selectedOptions: [], textAnswer: null }
      const correctOptions = q.options.filter((o) => o.isCorrect)
      const correctIds = correctOptions.map((o) => o.id)
      const correctTexts = correctOptions.map((o) => o.text.trim().toLowerCase())

      let isCorrect = false
      let pointsAwarded = 0

      if (q.type === 'single_choice' || q.type === 'true_false') {
        // Correct if selected option isCorrect
        const sel = submitted.selectedOptions[0]
        if (sel && correctIds.includes(sel)) {
          isCorrect = true
          pointsAwarded = q.points
        }
      } else if (q.type === 'multiple_choice') {
        const sel = submitted.selectedOptions
        const hasIncorrect = sel.some((s) => !correctIds.includes(s))
        const correctSelected = sel.filter((s) => correctIds.includes(s)).length
        if (sel.length === 0) {
          isCorrect = false
          pointsAwarded = 0
        } else if (hasIncorrect) {
          isCorrect = false
          pointsAwarded = 0
        } else if (correctSelected === correctIds.length) {
          // all correct selected, none incorrect
          isCorrect = true
          pointsAwarded = q.points
        } else {
          // partial credit (no incorrect selected, but not all correct)
          isCorrect = false
          pointsAwarded = Math.round((q.points * correctSelected / correctIds.length) * 100) / 100
        }
      } else if (q.type === 'fill_blank') {
        if (submitted.textAnswer && correctTexts.includes(submitted.textAnswer.toLowerCase())) {
          isCorrect = true
          pointsAwarded = q.points
        }
      }

      score += pointsAwarded

      answerRecords.push({
        questionId: q.id,
        selectedOptions: submitted.selectedOptions.length
          ? JSON.stringify(submitted.selectedOptions)
          : null,
        textAnswer: submitted.textAnswer,
        isCorrect,
        pointsAwarded,
      })
    }

    // Round score to integer-ish (keep 2 decimals if fractional)
    const finalScore = Math.round(score * 100) / 100
    const finalMaxScore = maxScore
    const percentage = finalMaxScore > 0 ? Math.round((finalScore / finalMaxScore) * 100) : 0
    const passed = percentage >= attempt.quiz.passingScore
    const timeSpentSec = Math.max(
      0,
      Math.floor((Date.now() - attempt.startedAt.getTime()) / 1000)
    )

    // Update attempt
    await db.quizAttempt.update({
      where: { id: attempt.id },
      data: {
        status: 'graded',
        score: finalScore,
        maxScore: finalMaxScore,
        percentage,
        passed,
        submittedAt: new Date(),
        timeSpentSec,
      },
    })

    // Create QuizAnswer records (delete any stale ones first if exists — though shouldn't happen)
    if (attempt.answers.length > 0) {
      await db.quizAnswer.deleteMany({ where: { attemptId: attempt.id } })
    }
    if (answerRecords.length > 0) {
      await db.quizAnswer.createMany({
        data: answerRecords.map((r) => ({
          attemptId: attempt.id,
          questionId: r.questionId,
          userId: user.id,
          selectedOptions: r.selectedOptions,
          textAnswer: r.textAnswer,
          isCorrect: r.isCorrect,
          pointsAwarded: r.pointsAwarded,
        })),
      })
    }

    await logActivity(
      user.id,
      'submit_quiz_attempt',
      'quiz',
      attempt.quizId,
      {
        attemptId: attempt.id,
        score: finalScore,
        maxScore: finalMaxScore,
        percentage,
        passed,
      },
      getClientIp(req)
    )

    // Certificate eligibility check:
    // If passed AND quiz is linked to a course AND student has an enrollment, check first pass.
    if (passed && attempt.quiz.courseId) {
      const enrollment = await db.enrollment.findUnique({
        where: {
          courseId_userId: { courseId: attempt.quiz.courseId, userId: user.id },
        },
        select: { id: true, status: true },
      })
      if (enrollment) {
        // Count prior passed attempts by this user for this quiz
        const priorPassed = await db.quizAttempt.count({
          where: {
            quizId: attempt.quizId,
            userId: user.id,
            passed: true,
            status: 'graded',
            id: { not: attempt.id },
          },
        })
        if (priorPassed === 0) {
          // First pass — certificate eligible (Certificates module will pick this up)
          await logActivity(
            user.id,
            'certificate_eligible',
            'quiz',
            attempt.quizId,
            {
              attemptId: attempt.id,
              courseId: attempt.quiz.courseId,
              score: finalScore,
              maxScore: finalMaxScore,
              percentage,
            },
            getClientIp(req)
          )
        }
      }
    }

    // Build per-question results to return
    const questionsWithResults = questions.map((q) => {
      const rec = answerRecords.find((r) => r.questionId === q.id)!
      const correctOptions = q.options.filter((o) => o.isCorrect)
      const sel = submittedMap.get(q.id)?.selectedOptions ?? []
      return {
        id: q.id,
        type: q.type,
        text: q.text,
        points: q.points,
        explanation: attempt.quiz.showAnswers ? q.explanation : null,
        isCorrect: rec.isCorrect,
        pointsAwarded: rec.pointsAwarded,
        selectedOptions: q.options
          .filter((o) => sel.includes(o.id))
          .map((o) => ({ id: o.id, text: o.text })),
        correctOptions: attempt.quiz.showAnswers
          ? correctOptions.map((o) => ({ id: o.id, text: o.text }))
          : [],
        allOptions: attempt.quiz.showAnswers
          ? q.options.map((o) => ({ id: o.id, text: o.text, isCorrect: o.isCorrect, order: o.order }))
          : q.options.map((o) => ({ id: o.id, text: o.text, order: o.order })),
        textAnswer: rec.textAnswer,
      }
    })

    return ok({
      id: attempt.id,
      quizId: attempt.quizId,
      status: 'graded',
      score: finalScore,
      maxScore: finalMaxScore,
      percentage,
      passed,
      startedAt: attempt.startedAt,
      submittedAt: new Date(),
      timeSpentSec,
      canSeeAnswers: attempt.quiz.showAnswers,
      questions: questionsWithResults,
    })
  } catch (e) {
    if (e instanceof Error && (e.message === 'UNAUTHORIZED' || e.message === 'FORBIDDEN')) {
      return err(e.message === 'FORBIDDEN' ? 403 : 401, e.message === 'FORBIDDEN' ? 'Ruxsat yo\'q' : 'Avtorizatsiya talab qilinadi')
    }
    console.error('POST /api/quizzes/attempts/[id] error:', e)
    return err(500, 'Server xatosi')
  }
}

export const dynamic = 'force-dynamic'
