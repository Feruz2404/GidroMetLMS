import type { Prisma } from '@prisma/client'
import { audit } from '@/server/audit'
import {
  canManageCourse,
  canManageQuiz,
  hasPermission,
  isAdminRole,
  isLearnerRole,
  PERMISSIONS,
  requirePermission,
  type Actor,
} from '@/server/auth/permissions'
import { db } from '@/server/db'
import { badRequest, conflict, forbidden, found, notFound } from '@/server/http/errors'
import { ilike, pageMeta, skipTake } from '@/server/http/request'
import type {
  AttemptStatus,
  AttemptSummaryDto,
  QuestionType,
  QuizDetailDto,
  QuizEditorDto,
  QuizListItemDto,
  QuizStatus,
} from '@/shared/dto'
import type { QuestionInput, QuizInput, QuizUpdateInput } from '@/shared/schemas'

const quizInclude = {
  course: { select: { id: true, title: true, tutorId: true, createdBy: true, status: true } },
  _count: { select: { questions: true, attempts: true } },
} satisfies Prisma.QuizInclude

type QuizSource = Prisma.QuizGetPayload<{ include: typeof quizInclude }>
type AttemptSource = Prisma.QuizAttemptGetPayload<object>

export function toAttemptSummary(attempt: AttemptSource): AttemptSummaryDto {
  return {
    id: attempt.id,
    status: attempt.status === 'in_progress' ? 'in_progress' : ('graded' as AttemptStatus),
    score: attempt.score,
    maxScore: attempt.maxScore,
    percentage: attempt.percentage,
    passed: attempt.passed,
    startedAt: attempt.startedAt.toISOString(),
    submittedAt: attempt.submittedAt?.toISOString() ?? null,
    timeSpentSec: attempt.timeSpentSec,
  }
}

function toListItem(quiz: QuizSource, actor: Actor, attempts: AttemptSource[] | null): QuizListItemDto {
  const graded = attempts?.filter((attempt) => attempt.status !== 'in_progress') ?? []
  return {
    id: quiz.id,
    title: quiz.title,
    description: quiz.description,
    status: quiz.status as QuizStatus,
    timeLimitMin: quiz.timeLimitMin,
    passingScore: quiz.passingScore,
    maxAttempts: quiz.maxAttempts,
    questionCount: quiz._count.questions,
    attemptCount: quiz._count.attempts,
    course: quiz.course ? { id: quiz.course.id, title: quiz.course.title } : null,
    canManage: canManageQuiz(actor, quiz),
    my: attempts
      ? {
          attemptsUsed: attempts.length,
          bestPercentage: graded.length ? Math.max(...graded.map((attempt) => attempt.percentage)) : null,
          passed: graded.some((attempt) => attempt.passed),
          inProgressAttemptId: attempts.find((attempt) => attempt.status === 'in_progress')?.id ?? null,
        }
      : null,
    updatedAt: quiz.updatedAt.toISOString(),
  }
}

/** Quizzes the actor may see. Learners only see published quizzes of published (or no) courses. */
export function visibleQuizzesWhere(actor: Actor): Prisma.QuizWhereInput {
  if (isAdminRole(actor.role)) return {}
  if (hasPermission(actor.role, PERMISSIONS.ASSESSMENTS_MANAGE)) {
    return {
      OR: [
        { status: 'published' },
        { createdBy: actor.id },
        { course: { OR: [{ tutorId: actor.id }, { createdBy: actor.id }] } },
      ],
    }
  }
  return { status: 'published', OR: [{ courseId: null }, { course: { status: 'published' } }] }
}

export interface QuizListQuery {
  search?: string
  courseId?: string
  status?: QuizStatus
  view: 'all' | 'managed' | 'available' | 'passed'
  page: number
  limit: number
}

export async function listQuizzes(actor: Actor, query: QuizListQuery) {
  const learner = isLearnerRole(actor.role)
  const and: Prisma.QuizWhereInput[] = [visibleQuizzesWhere(actor)]
  if (!query.status) and.push({ status: { not: 'archived' } })
  else if (!learner) and.push({ status: query.status })
  if (query.search) and.push({ OR: [{ title: ilike(query.search) }, { description: ilike(query.search) }, { course: { title: ilike(query.search) } }] })
  if (query.courseId) and.push({ courseId: query.courseId })
  if (query.view === 'managed' && !isAdminRole(actor.role)) {
    and.push({ OR: [{ createdBy: actor.id }, { course: { OR: [{ tutorId: actor.id }, { createdBy: actor.id }] } }] })
  }
  if (query.view === 'available') and.push({ course: { enrollments: { some: { userId: actor.id, status: { not: 'dropped' } } } } })
  if (query.view === 'passed') and.push({ attempts: { some: { userId: actor.id, passed: true } } })

  const where: Prisma.QuizWhereInput = { AND: and }
  const [total, quizzes] = await Promise.all([
    db.quiz.count({ where }),
    db.quiz.findMany({
      where,
      include: { ...quizInclude, attempts: learner ? { where: { userId: actor.id } } : false },
      orderBy: [{ updatedAt: 'desc' }],
      ...skipTake(query.page, query.limit),
    }),
  ])
  return {
    items: quizzes.map((quiz) => toListItem(quiz, actor, learner ? (quiz as typeof quiz & { attempts: AttemptSource[] }).attempts : null)),
    meta: pageMeta(total, query.page, query.limit),
  }
}

async function findVisibleQuiz(actor: Actor, quizId: string) {
  const quiz = await db.quiz.findFirst({ where: { AND: [{ id: quizId }, visibleQuizzesWhere(actor)] }, include: quizInclude })
  if (!quiz) throw notFound('Quiz')
  return quiz
}

export async function getQuizDetail(actor: Actor, quizId: string): Promise<QuizDetailDto> {
  const quiz = await findVisibleQuiz(actor, quizId)
  const learner = isLearnerRole(actor.role)
  const attempts = learner
    ? await db.quizAttempt.findMany({ where: { quizId, userId: actor.id }, orderBy: { startedAt: 'desc' } })
    : []

  let blockedReason: QuizDetailDto['blockedReason'] = null
  if (learner) {
    if (quiz.status !== 'published') blockedReason = 'NOT_PUBLISHED'
    else if (quiz._count.questions === 0) blockedReason = 'QUIZ_EMPTY'
    else if (quiz.courseId && !(await isEnrolled(actor.id, quiz.courseId))) blockedReason = 'NOT_ENROLLED'
    else if (attempts.filter((attempt) => attempt.status !== 'in_progress').length >= quiz.maxAttempts) blockedReason = 'ATTEMPTS_EXHAUSTED'
  }

  const used = attempts.filter((attempt) => attempt.status !== 'in_progress').length
  return {
    ...toListItem(quiz, actor, learner ? attempts : null),
    shuffleQuestions: quiz.shuffleQuestions,
    showAnswers: quiz.showAnswers,
    attempts: attempts.map(toAttemptSummary),
    attemptsRemaining: learner ? Math.max(0, quiz.maxAttempts - used) : null,
    blockedReason,
  }
}

export async function isEnrolled(userId: string, courseId: string): Promise<boolean> {
  const enrollment = await db.enrollment.findUnique({ where: { courseId_userId: { courseId, userId } }, select: { status: true } })
  return Boolean(enrollment && enrollment.status !== 'dropped')
}

// --- Authoring ------------------------------------------------------------------

async function findManagedQuiz(actor: Actor, quizId: string) {
  const quiz = found(await db.quiz.findUnique({ where: { id: quizId }, include: quizInclude }), 'Quiz')
  if (!canManageQuiz(actor, quiz)) throw forbidden()
  return quiz
}

/** Instructors may only attach assessments to courses they manage. */
async function assertCourseAttachable(actor: Actor, courseId: string | null | undefined) {
  if (!courseId) return
  const course = found(await db.course.findUnique({ where: { id: courseId } }), 'Course')
  if (!canManageCourse(actor, course)) throw forbidden()
}

function questionCreateData(questions: QuestionInput[]): Prisma.QuestionCreateWithoutQuizInput[] {
  return questions.map((question, index) => ({
    type: question.type,
    text: question.text,
    points: question.points,
    explanation: question.explanation,
    order: index + 1,
    options: {
      create: question.options.map((option, optionIndex) => ({ text: option.text, isCorrect: option.isCorrect, order: optionIndex + 1 })),
    },
  }))
}

export async function getQuizEditor(actor: Actor, quizId: string): Promise<QuizEditorDto> {
  await findManagedQuiz(actor, quizId)
  const quiz = await db.quiz.findUniqueOrThrow({
    where: { id: quizId },
    include: {
      questions: { orderBy: { order: 'asc' }, include: { options: { orderBy: { order: 'asc' } } } },
      _count: { select: { attempts: { where: { status: 'graded' } } } },
    },
  })
  return {
    id: quiz.id,
    title: quiz.title,
    description: quiz.description,
    courseId: quiz.courseId,
    status: quiz.status as QuizStatus,
    timeLimitMin: quiz.timeLimitMin,
    passingScore: quiz.passingScore,
    maxAttempts: quiz.maxAttempts,
    shuffleQuestions: quiz.shuffleQuestions,
    showAnswers: quiz.showAnswers,
    hasAttempts: quiz._count.attempts > 0,
    questions: quiz.questions.map((question) => ({
      id: question.id,
      type: question.type as QuestionType,
      text: question.text,
      points: question.points,
      explanation: question.explanation,
      options: question.options.map((option) => ({ id: option.id, text: option.text, isCorrect: option.isCorrect })),
    })),
  }
}

export async function createQuiz(actor: Actor, input: QuizInput, req: Request) {
  requirePermission(actor, PERMISSIONS.ASSESSMENTS_MANAGE)
  await assertCourseAttachable(actor, input.courseId)
  const { questions, ...fields } = input
  const quiz = await db.quiz.create({
    data: { ...fields, createdBy: actor.id, questions: { create: questionCreateData(questions) } },
  })
  await audit({ userId: actor.id, action: 'create_quiz', entity: 'quiz', entityId: quiz.id, metadata: { questions: questions.length }, request: req })
  return getQuizEditor(actor, quiz.id)
}

export async function updateQuiz(actor: Actor, quizId: string, input: QuizUpdateInput, req: Request) {
  const quiz = await findManagedQuiz(actor, quizId)
  if (input.courseId !== undefined && input.courseId !== quiz.courseId) await assertCourseAttachable(actor, input.courseId)

  const { questions, ...fields } = input
  if (fields.status === 'published' && !questions && quiz._count.questions === 0) {
    throw badRequest('QUIZ_EMPTY', 'Add questions before publishing')
  }
  await db.$transaction(async (tx) => {
    if (questions) {
      // Replacing questions would orphan graded answers, so it is blocked once learners have results.
      const graded = await tx.quizAttempt.count({ where: { quizId, status: 'graded' } })
      if (graded > 0) throw conflict('QUIZ_HAS_ATTEMPTS', 'Questions cannot change after learners have submitted attempts')
      await tx.quizAttempt.deleteMany({ where: { quizId, status: 'in_progress' } })
      await tx.question.deleteMany({ where: { quizId } })
    }
    await tx.quiz.update({
      where: { id: quizId },
      data: { ...fields, ...(questions ? { questions: { create: questionCreateData(questions) } } : {}) },
    })
  })
  await audit({ userId: actor.id, action: 'update_quiz', entity: 'quiz', entityId: quizId, metadata: { fields: Object.keys(input) }, request: req })
  return getQuizEditor(actor, quizId)
}

export async function archiveQuiz(actor: Actor, quizId: string, req: Request) {
  await findManagedQuiz(actor, quizId)
  await db.quiz.update({ where: { id: quizId }, data: { status: 'archived' } })
  await audit({ userId: actor.id, action: 'archive_quiz', entity: 'quiz', entityId: quizId, request: req })
}
