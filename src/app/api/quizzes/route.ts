import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser, ok, err, logActivity, getClientIp } from '@/lib/auth'

// GET /api/quizzes — paginated list with filters
// Query: search, courseId, status, page (1), limit (12)
export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)
    if (!user) return err(401, 'Avtorizatsiya talab qilinadi')

    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search')?.trim() ?? ''
    const courseId = searchParams.get('courseId') ?? ''
    const status = searchParams.get('status') ?? ''
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
    const limit = Math.min(60, Math.max(1, parseInt(searchParams.get('limit') ?? '12', 10)))

    // Build where clause based on role
    // Students: only published quizzes
    // Tutors/Admins: their own (any status) + published quizzes from others
    const where: Record<string, unknown> = {}

    if (user.role === 'student') {
      where.status = 'published'
    } else if (status) {
      where.status = status
    } else {
      // tutor/admin default: published OR own
      where.OR = [{ status: 'published' }, { createdBy: user.id }]
    }

    if (courseId) where.courseId = courseId

    if (search) {
      const searchOR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ]
      if (Array.isArray(where.OR)) {
        where.AND = [where.OR.length === 1 ? where.OR[0] : { OR: where.OR }, { OR: searchOR }]
        delete where.OR
      } else {
        where.OR = searchOR
      }
    }

    const [total, quizzes] = await Promise.all([
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      db.quiz.count({ where: where as any }),
      db.quiz.findMany({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        where: where as any,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          course: { select: { id: true, title: true } },
          _count: { select: { questions: true, attempts: true } },
          ...(user.role === 'student'
            ? {
                attempts: {
                  where: { userId: user.id },
                  select: { id: true, status: true, score: true, maxScore: true, percentage: true, passed: true, submittedAt: true },
                },
              }
            : {}),
        },
      }),
    ])

    // For students, flatten attempts → best score (graded only) + total attempts count (incl. in_progress)
    const data = quizzes.map((q) => {
      const { attempts, ...rest } = q as typeof q & {
        attempts?: Array<{ id: string; status: string; score: number; maxScore: number; percentage: number; passed: boolean; submittedAt: Date }>
      }
      if (user.role !== 'student' || !attempts) {
        return { ...rest, myAttempts: 0, bestScore: null }
      }
      const graded = attempts.filter((a) => a.status === 'graded')
      const best = graded.reduce((acc, a) => (a.percentage > acc ? a.percentage : acc), 0)
      const hasAny = graded.length > 0
      return {
        ...rest,
        myAttempts: attempts.length, // includes in_progress + graded
        bestScore: hasAny ? best : null,
      }
    })

    return ok(data, { total, page, pages: Math.max(1, Math.ceil(total / limit)), limit })
  } catch (e) {
    if (e instanceof Error && (e.message === 'UNAUTHORIZED' || e.message === 'FORBIDDEN')) {
      return err(e.message === 'FORBIDDEN' ? 403 : 401, e.message === 'FORBIDDEN' ? 'Ruxsat yo\'q' : 'Avtorizatsiya talab qilinadi')
    }
    console.error('GET /api/quizzes error:', e)
    return err(500, 'Server xatosi')
  }
}

// POST /api/quizzes — tutor/admin create new quiz with questions
// Body: { title, description, courseId?, lessonId?, timeLimitMin, passingScore, maxAttempts,
//   shuffleQuestions, showAnswers, status, questions: [{ type, text, points, explanation?, order?,
//   options: [{ text, isCorrect, order? }] }] }
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)
    if (!user) return err(401, 'Avtorizatsiya talab qilinadi')
    if (!['tutor', 'admin'].includes(user.role)) return err(403, 'Ruxsat yo\'q')

    const body = await req.json()
    const {
      title,
      description,
      courseId,
      lessonId,
      timeLimitMin,
      passingScore,
      maxAttempts,
      shuffleQuestions,
      showAnswers,
      status,
      questions,
    } = body as Record<string, unknown>

    if (!title || typeof title !== 'string' || title.trim().length < 3) {
      return err(400, 'Sarlavha kamida 3 ta belgidan iborat bo\'lishi kerak')
    }

    const questionsArr = Array.isArray(questions) ? questions : []
    if (questionsArr.length === 0) {
      return err(400, 'Kamida bitta savol qo\'shing')
    }

    // Validate each question
    for (const [i, qRaw] of questionsArr.entries()) {
      const q = qRaw as Record<string, unknown>
      if (!q || typeof q !== 'object') {
        return err(400, `${i + 1}-savol noto\'g\'ri formatda`)
      }
      const qType = q.type as string
      if (!['single_choice', 'multiple_choice', 'true_false', 'fill_blank'].includes(qType)) {
        return err(400, `${i + 1}-savol: noma\'lum tur`)
      }
      if (!q.text || typeof q.text !== 'string' || (q.text as string).trim().length < 1) {
        return err(400, `${i + 1}-savol: matn bo\'sh`)
      }
      const opts = Array.isArray(q.options) ? q.options : []
      if (qType !== 'fill_blank' && opts.length < 2) {
        return err(400, `${i + 1}-savol: kamida 2 ta variant kerak`)
      }
      if (qType !== 'fill_blank' && !opts.some((o) => (o as Record<string, unknown>)?.isCorrect === true)) {
        return err(400, `${i + 1}-savol: to\'g\'ri javobni belgilang`)
      }
      if (qType === 'fill_blank' && !opts.some((o) => (o as Record<string, unknown>)?.isCorrect === true)) {
        return err(400, `${i + 1}-savol: to\'g\'ri javobni kiriting`)
      }
    }

    const quiz = await db.quiz.create({
      data: {
        title: title as string,
        description: (description as string) ?? null,
        courseId: (courseId as string) || null,
        lessonId: (lessonId as string) || null,
        timeLimitMin: Number(timeLimitMin) || 30,
        passingScore: Number(passingScore) || 70,
        maxAttempts: Number(maxAttempts) || 3,
        shuffleQuestions: Boolean(shuffleQuestions),
        showAnswers: Boolean(showAnswers),
        status: (status as string) || 'draft',
        createdBy: user.id,
        questions: {
          create: questionsArr.map((qRaw, idx) => {
            const q = qRaw as Record<string, unknown>
            const opts = (q.options as Array<Record<string, unknown>>) ?? []
            return {
              type: (q.type as string) || 'single_choice',
              text: (q.text as string).trim(),
              points: Number(q.points) || 1,
              explanation: (q.explanation as string) ?? null,
              order: Number(q.order) || idx + 1,
              options: {
                create: opts.map((o, oi) => ({
                  text: String(o.text ?? '').trim(),
                  isCorrect: Boolean(o.isCorrect),
                  order: Number(o.order) || oi + 1,
                })),
              },
            }
          }),
        },
      },
      include: {
        course: { select: { id: true, title: true } },
        _count: { select: { questions: true, attempts: true } },
        questions: { include: { options: true }, orderBy: { order: 'asc' } },
      },
    })

    await logActivity(user.id, 'create_quiz', 'quiz', quiz.id, { title: quiz.title }, getClientIp(req))

    return ok(quiz)
  } catch (e) {
    if (e instanceof Error && (e.message === 'UNAUTHORIZED' || e.message === 'FORBIDDEN')) {
      return err(e.message === 'FORBIDDEN' ? 403 : 401, e.message === 'FORBIDDEN' ? 'Ruxsat yo\'q' : 'Avtorizatsiya talab qilinadi')
    }
    console.error('POST /api/quizzes error:', e)
    return err(500, 'Server xatosi')
  }
}

export const dynamic = 'force-dynamic'
