import { authedRoute } from '@/server/http/handler'
import { parseBody } from '@/server/http/request'
import { ok } from '@/server/http/response'
import { archiveQuiz, getQuizDetail, updateQuiz } from '@/server/modules/quizzes/service'
import { quizUpdateSchema } from '@/shared/schemas'

type Params = { id: string }

// GET /api/quizzes/[id] — assessment overview; never includes correct answers.
export const GET = authedRoute<Params>(async (_req, { user, params }) => ok(await getQuizDetail(user, params.id)))

// PATCH /api/quizzes/[id] — update settings and, while no results exist, the questions.
export const PATCH = authedRoute<Params>(async (req, { user, params }) =>
  ok(await updateQuiz(user, params.id, await parseBody(req, quizUpdateSchema), req))
)

export const DELETE = authedRoute<Params>(async (req, { user, params }) => {
  await archiveQuiz(user, params.id, req)
  return ok({ archived: true })
})
