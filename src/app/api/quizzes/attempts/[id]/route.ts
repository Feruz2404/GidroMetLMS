import { authedRoute } from '@/server/http/handler'
import { parseBody } from '@/server/http/request'
import { ok } from '@/server/http/response'
import { getAttempt, submitAttempt } from '@/server/modules/quizzes/attempts'
import { attemptSubmissionSchema } from '@/shared/schemas'

type Params = { id: string }

// GET /api/quizzes/attempts/[id] — the open session (to resume) or the graded result.
export const GET = authedRoute<Params>(async (_req, { user, params }) => ok(await getAttempt(user, params.id)))

// POST /api/quizzes/attempts/[id] — submit answers for grading.
export const POST = authedRoute<Params>(async (req, { user, params }) => {
  const { answers } = await parseBody(req, attemptSubmissionSchema)
  return ok(await submitAttempt(user, params.id, answers, req))
})
