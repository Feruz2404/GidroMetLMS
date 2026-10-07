import { authedRoute } from '@/server/http/handler'
import { ok } from '@/server/http/response'
import { startAttempt } from '@/server/modules/quizzes/attempts'

// POST /api/quizzes/[id]/attempt — start (or resume) an attempt.
export const POST = authedRoute<{ id: string }>(async (req, { user, params }) => ok(await startAttempt(user, params.id, req)))
