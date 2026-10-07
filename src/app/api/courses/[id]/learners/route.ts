import { authedRoute } from '@/server/http/handler'
import { ok } from '@/server/http/response'
import { listCourseLearners } from '@/server/modules/courses/service'

// GET /api/courses/[id]/learners — enrolment roster with progress, best score and certificate.
export const GET = authedRoute<{ id: string }>(async (_req, { user, params }) => ok(await listCourseLearners(user, params.id)))
