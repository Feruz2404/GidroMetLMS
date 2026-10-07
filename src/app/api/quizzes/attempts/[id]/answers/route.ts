import { authedRoute } from '@/server/http/handler'
import { parseBody } from '@/server/http/request'
import { ok } from '@/server/http/response'
import { getSavedAnswers, saveAnswers } from '@/server/modules/quizzes/attempts'
import { attemptSubmissionSchema } from '@/shared/schemas'

type Params = { id: string }

// GET /api/quizzes/attempts/[id]/answers — autosaved answers of an open attempt.
export const GET = authedRoute<Params>(async (_req, { user, params }) => ok(await getSavedAnswers(user, params.id)))

// PUT /api/quizzes/attempts/[id]/answers — autosave answers while the attempt is open.
export const PUT = authedRoute<Params>(async (req, { user, params }) => {
  const { answers } = await parseBody(req, attemptSubmissionSchema)
  return ok(await saveAnswers(user, params.id, answers))
})
