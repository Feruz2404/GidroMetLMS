import type { Prisma } from '@prisma/client'
import { audit } from '@/server/audit'
import { canManageQuiz, isLearnerRole, isManagerRole, type Actor } from '@/server/auth/permissions'
import { db } from '@/server/db'
import { conflict, forbidden, found, notFound, unprocessable } from '@/server/http/errors'
import { issueCertificateIfEligible } from '@/server/modules/certificates/service'
import { notify } from '@/server/modules/notifications/service'
import { toUserSummary, userSummarySelect } from '@/server/modules/users/mapper'
import type { AttemptResultDto, AttemptSessionDto, QuestionType, SubmittedAnswerDto } from '@/shared/dto'
import { attemptDeadline, gradeAttempt, isAttemptExpired, seededShuffle, type SubmittedAnswer } from './grading'
import { isEnrolled, toAttemptSummary } from './service'

const questionsInclude = {
  questions: { orderBy: { order: 'asc' }, include: { options: { orderBy: { order: 'asc' } } } },
} satisfies Prisma.QuizInclude

type QuizWithQuestions = Prisma.QuizGetPayload<{ include: typeof questionsInclude }>

function parseSelected(value: string | null): string[] {
  if (!value) return []
  try {
    const parsed: unknown = JSON.parse(value)
    return Array.isArray(parsed) ? parsed.map(String) : []
  } catch {
    return []
  }
}

async function loadSavedAnswers(attemptId: string): Promise<Map<string, SubmittedAnswer>> {
  const saved = await db.quizAnswer.findMany({ where: { attemptId } })
  return new Map(saved.map((answer) => [answer.questionId, { selectedOptions: parseSelected(answer.selectedOptions), textAnswer: answer.textAnswer }]))
}

function toSession(
  attempt: { id: string; startedAt: Date },
  quiz: QuizWithQuestions,
  attemptsRemaining: number,
  resumed: boolean
): AttemptSessionDto {
  const questions = quiz.shuffleQuestions ? seededShuffle(quiz.questions, attempt.id) : quiz.questions
  return {
    attemptId: attempt.id,
    quiz: { id: quiz.id, title: quiz.title, description: quiz.description, passingScore: quiz.passingScore, timeLimitMin: quiz.timeLimitMin },
    questions: questions.map((question) => ({
      id: question.id,
      type: question.type as QuestionType,
      text: question.text,
      points: question.points,
      // Correctness never leaves the server before grading; fill-in options are the answers themselves.
      options: question.type === 'fill_blank' ? [] : question.options.map((option) => ({ id: option.id, text: option.text })),
    })),
    startedAt: attempt.startedAt.toISOString(),
    expiresAt: attemptDeadline(attempt.startedAt, quiz.timeLimitMin).toISOString(),
    attemptsRemaining,
    resumed,
  }
}

/** Grades and closes an attempt. Idempotent: a concurrent finalisation wins and the loser gets a conflict. */
async function finalizeAttempt(attemptId: string, quiz: QuizWithQuestions, answers: Map<string, SubmittedAnswer>, userId: string) {
  const attempt = found(await db.quizAttempt.findUnique({ where: { id: attemptId } }), 'Attempt')
  const grade = gradeAttempt(quiz.questions, answers)
  const passed = grade.percentage >= quiz.passingScore
  const submittedAt = new Date()

  await db.$transaction(async (tx) => {
    const closed = await tx.quizAttempt.updateMany({
      where: { id: attemptId, status: 'in_progress' },
      data: {
        status: 'graded',
        score: grade.score,
        maxScore: grade.maxScore,
        percentage: grade.percentage,
        passed,
        submittedAt,
        timeSpentSec: Math.max(0, Math.round((submittedAt.getTime() - attempt.startedAt.getTime()) / 1000)),
      },
    })
    if (closed.count !== 1) throw conflict('ATTEMPT_FINALIZED', 'This attempt has already been submitted')
    await tx.quizAnswer.deleteMany({ where: { attemptId } })
    await tx.quizAnswer.createMany({
      data: grade.questions.map((question) => ({
        attemptId,
        questionId: question.questionId,
        userId,
        selectedOptions: question.selectedOptions.length ? JSON.stringify(question.selectedOptions) : null,
        textAnswer: question.textAnswer,
        isCorrect: question.isCorrect,
        pointsAwarded: question.pointsAwarded,
      })),
    })
  })
  return { grade, passed }
}

async function loadQuiz(quizId: string) {
  return found(await db.quiz.findUnique({ where: { id: quizId }, include: questionsInclude }), 'Quiz')
}

/** Closes expired in-progress attempts using whatever answers were autosaved before the deadline. */
async function closeIfExpired(attempt: { id: string; status: string; startedAt: Date; userId: string }, quiz: QuizWithQuestions) {
  if (attempt.status !== 'in_progress' || !isAttemptExpired(attempt.startedAt, quiz.timeLimitMin)) return false
  try {
    await finalizeAttempt(attempt.id, quiz, await loadSavedAnswers(attempt.id), attempt.userId)
  } catch (error) {
    if (!(error instanceof Error && 'code' in error && error.code === 'ATTEMPT_FINALIZED')) throw error
  }
  return true
}

export async function startAttempt(actor: Actor, quizId: string, req: Request): Promise<AttemptSessionDto> {
  if (!isLearnerRole(actor.role)) throw forbidden('LEARNERS_ONLY', 'Only learners take assessments')
  const quiz = await loadQuiz(quizId)
  if (quiz.status !== 'published') throw notFound('Quiz')
  if (quiz.questions.length === 0) throw unprocessable('QUIZ_EMPTY', 'The assessment has no questions')
  if (quiz.courseId && !(await isEnrolled(actor.id, quiz.courseId))) {
    throw forbidden('NOT_ENROLLED', 'Enroll in the course to take its assessment')
  }

  const attempts = await db.quizAttempt.findMany({ where: { quizId, userId: actor.id }, orderBy: { startedAt: 'desc' } })
  const open = attempts.find((attempt) => attempt.status === 'in_progress')
  if (open && !(await closeIfExpired(open, quiz))) {
    const used = attempts.filter((attempt) => attempt.status !== 'in_progress').length
    return toSession(open, quiz, Math.max(0, quiz.maxAttempts - used - 1), true)
  }

  const used = await db.quizAttempt.count({ where: { quizId, userId: actor.id, status: 'graded' } })
  if (used >= quiz.maxAttempts) throw conflict('ATTEMPTS_EXHAUSTED', 'No attempts left')

  const attempt = await db.quizAttempt.create({ data: { quizId, userId: actor.id, status: 'in_progress' } })
  await audit({ userId: actor.id, action: 'start_quiz_attempt', entity: 'quiz', entityId: quizId, metadata: { attemptId: attempt.id }, request: req })
  return toSession(attempt, quiz, quiz.maxAttempts - used - 1, false)
}

function toAnswerMap(answers: SubmittedAnswerDto[]): Map<string, SubmittedAnswer> {
  return new Map(answers.map((answer) => [answer.questionId, { selectedOptions: answer.selectedOptions, textAnswer: answer.textAnswer }]))
}

async function findOwnOpenAttempt(actor: Actor, attemptId: string) {
  const attempt = found(await db.quizAttempt.findUnique({ where: { id: attemptId } }), 'Attempt')
  if (attempt.userId !== actor.id) throw forbidden()
  return attempt
}

/** Autosaves answers while the attempt is open, so a closed tab or lost connection loses nothing. */
export async function saveAnswers(actor: Actor, attemptId: string, answers: SubmittedAnswerDto[]) {
  const attempt = await findOwnOpenAttempt(actor, attemptId)
  if (attempt.status !== 'in_progress') throw conflict('ATTEMPT_FINALIZED', 'This attempt has already been submitted')
  const quiz = await loadQuiz(attempt.quizId)
  if (isAttemptExpired(attempt.startedAt, quiz.timeLimitMin)) throw conflict('TIME_LIMIT_EXCEEDED', 'Time is up')

  const questionIds = new Set(quiz.questions.map((question) => question.id))
  const valid = answers.filter((answer) => questionIds.has(answer.questionId))
  await db.$transaction([
    db.quizAnswer.deleteMany({ where: { attemptId, questionId: { in: valid.map((answer) => answer.questionId) } } }),
    db.quizAnswer.createMany({
      data: valid.map((answer) => ({
        attemptId,
        questionId: answer.questionId,
        userId: actor.id,
        selectedOptions: answer.selectedOptions?.length ? JSON.stringify(answer.selectedOptions.slice(0, 20)) : null,
        textAnswer: answer.textAnswer?.slice(0, 4000) || null,
      })),
    }),
  ])
  return { saved: valid.length }
}

export async function submitAttempt(actor: Actor, attemptId: string, answers: SubmittedAnswerDto[], req: Request): Promise<AttemptResultDto> {
  const attempt = await findOwnOpenAttempt(actor, attemptId)
  if (attempt.status !== 'in_progress') throw conflict('ATTEMPT_FINALIZED', 'This attempt has already been submitted')
  const quiz = await loadQuiz(attempt.quizId)

  // Answers arriving after the deadline (plus grace) are ignored; the autosaved ones count.
  const expired = isAttemptExpired(attempt.startedAt, quiz.timeLimitMin)
  const answerMap = expired ? await loadSavedAnswers(attemptId) : toAnswerMap(answers)
  const { grade, passed } = await finalizeAttempt(attemptId, quiz, answerMap, actor.id)

  await audit({
    userId: actor.id,
    action: 'submit_quiz_attempt',
    entity: 'quiz',
    entityId: quiz.id,
    metadata: { attemptId, percentage: grade.percentage, passed, expired },
    request: req,
  })
  await notify(actor.id, {
    type: passed ? 'success' : 'warning',
    title: passed ? 'Test muvaffaqiyatli topshirildi' : 'Test natijasi',
    message: `“${quiz.title}”: ${grade.percentage}% (o‘tish chegarasi ${quiz.passingScore}%).`,
    link: `/attempts/${attemptId}`,
  })
  if (passed && quiz.courseId) await issueCertificateIfEligible(actor.id, quiz.courseId)
  return getAttemptResult(actor, attemptId)
}

export type AttemptView = { kind: 'session'; session: AttemptSessionDto } | { kind: 'result'; result: AttemptResultDto }

/** Returns the live session for an open attempt (to resume it) or the graded result. */
export async function getAttempt(actor: Actor, attemptId: string): Promise<AttemptView> {
  const attempt = found(await db.quizAttempt.findUnique({ where: { id: attemptId } }), 'Attempt')
  const quiz = await loadQuiz(attempt.quizId)
  await closeIfExpired(attempt, quiz)
  const fresh = await db.quizAttempt.findUniqueOrThrow({ where: { id: attemptId } })
  if (fresh.status === 'in_progress') {
    if (fresh.userId !== actor.id) throw forbidden()
    const used = await db.quizAttempt.count({ where: { quizId: quiz.id, userId: actor.id, status: 'graded' } })
    const session = toSession(fresh, quiz, Math.max(0, quiz.maxAttempts - used - 1), true)
    return { kind: 'session', session }
  }
  return { kind: 'result', result: await getAttemptResult(actor, attemptId) }
}

export async function getSavedAnswers(actor: Actor, attemptId: string): Promise<SubmittedAnswerDto[]> {
  await findOwnOpenAttempt(actor, attemptId)
  const saved = await loadSavedAnswers(attemptId)
  return [...saved.entries()].map(([questionId, answer]) => ({
    questionId,
    selectedOptions: answer.selectedOptions,
    textAnswer: answer.textAnswer ?? undefined,
  }))
}

export async function getAttemptResult(actor: Actor, attemptId: string): Promise<AttemptResultDto> {
  const attempt = found(
    await db.quizAttempt.findUnique({
      where: { id: attemptId },
      include: {
        user: { select: userSummarySelect },
        answers: true,
        quiz: {
          include: {
            ...questionsInclude,
            course: { select: { id: true, title: true, tutorId: true, createdBy: true } },
          },
        },
      },
    }),
    'Attempt'
  )
  const isOwner = attempt.userId === actor.id
  const isReviewer =
    canManageQuiz(actor, attempt.quiz) || (isManagerRole(actor.role) && Boolean(actor.department) && attempt.user.department === actor.department)
  if (!isOwner && !isReviewer) throw forbidden()
  if (attempt.status === 'in_progress') throw conflict('CONFLICT', 'The attempt is still in progress')

  const canSeeAnswers = attempt.quiz.showAnswers || isReviewer
  const answers = new Map(attempt.answers.map((answer) => [answer.questionId, answer]))
  const certificate = attempt.passed && attempt.quiz.courseId
    ? await db.certificate.findFirst({
        where: { userId: attempt.userId, courseId: attempt.quiz.courseId, status: 'active' },
        select: { id: true, certNumber: true },
      })
    : null

  return {
    ...toAttemptSummary(attempt),
    quiz: {
      id: attempt.quiz.id,
      title: attempt.quiz.title,
      passingScore: attempt.quiz.passingScore,
      course: attempt.quiz.course ? { id: attempt.quiz.course.id, title: attempt.quiz.course.title } : null,
    },
    learner: toUserSummary(attempt.user),
    canSeeAnswers,
    certificate,
    questions: attempt.quiz.questions.map((question) => {
      const answer = answers.get(question.id)
      const selected = parseSelected(answer?.selectedOptions ?? null)
      return {
        id: question.id,
        type: question.type as QuestionType,
        text: question.text,
        points: question.points,
        pointsAwarded: answer?.pointsAwarded ?? 0,
        isCorrect: answer?.isCorrect ?? false,
        textAnswer: answer?.textAnswer ?? null,
        explanation: canSeeAnswers ? question.explanation : null,
        options:
          question.type === 'fill_blank'
            ? []
            : question.options.map((option) => ({
                id: option.id,
                text: option.text,
                selected: selected.includes(option.id),
                isCorrect: canSeeAnswers ? option.isCorrect : null,
              })),
        acceptedAnswers: question.type === 'fill_blank' && canSeeAnswers ? question.options.map((option) => option.text) : null,
      }
    }),
  }
}

export async function listQuizAttempts(actor: Actor, quizId: string) {
  const quiz = found(
    await db.quiz.findUnique({ where: { id: quizId }, include: { course: { select: { tutorId: true, createdBy: true } } } }),
    'Quiz'
  )
  if (!canManageQuiz(actor, quiz)) throw forbidden()
  const attempts = await db.quizAttempt.findMany({
    where: { quizId, status: 'graded' },
    include: { user: { select: userSummarySelect } },
    orderBy: { submittedAt: 'desc' },
    take: 500,
  })
  return attempts.map((attempt) => ({ ...toAttemptSummary(attempt), learner: toUserSummary(attempt.user) }))
}
