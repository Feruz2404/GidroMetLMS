import { authedRoute } from '@/server/http/handler'
import { ok } from '@/server/http/response'
import { enroll } from '@/server/modules/courses/service'

// POST /api/courses/[id]/enroll — learner self-enrollment.
export const POST = authedRoute<{ id: string }>(async (req, { user, params }) => ok(await enroll(user, params.id, req)))
