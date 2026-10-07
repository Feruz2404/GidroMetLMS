import { authedRoute } from '@/server/http/handler'
import { ok } from '@/server/http/response'
import { getQuizEditor } from '@/server/modules/quizzes/service'

// GET /api/quizzes/[id]/editor — full question bank with answers (authors only).
export const GET = authedRoute<{ id: string }>(async (_req, { user, params }) => ok(await getQuizEditor(user, params.id)))
