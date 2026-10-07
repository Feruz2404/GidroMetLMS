import { z } from 'zod'
import { authedRoute } from '@/server/http/handler'
import { paginationQuery, parseBody, parseQuery } from '@/server/http/request'
import { ok } from '@/server/http/response'
import { createQuiz, listQuizzes } from '@/server/modules/quizzes/service'
import { quizInputSchema } from '@/shared/schemas'

const listQuery = z.object({
  ...paginationQuery,
  search: z.string().trim().max(100).optional(),
  courseId: z.string().max(60).optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  view: z.enum(['all', 'managed', 'available', 'passed']).catch('all').default('all'),
})

// GET /api/quizzes — assessments visible to the caller, with the learner's own attempt summary.
export const GET = authedRoute(async (req, { user }) => {
  const { items, meta } = await listQuizzes(user, parseQuery(req, listQuery))
  return ok(items, meta)
})

// POST /api/quizzes — create an assessment with its questions.
export const POST = authedRoute(async (req, { user }) => ok(await createQuiz(user, await parseBody(req, quizInputSchema), req)))
