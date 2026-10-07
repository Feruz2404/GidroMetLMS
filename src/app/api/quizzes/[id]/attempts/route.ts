import { authedRoute } from '@/server/http/handler'
import { ok } from '@/server/http/response'
import { listQuizAttempts } from '@/server/modules/quizzes/attempts'

// GET /api/quizzes/[id]/attempts — graded attempts of an assessment (authors only).
export const GET = authedRoute<{ id: string }>(async (_req, { user, params }) => ok(await listQuizAttempts(user, params.id)))
