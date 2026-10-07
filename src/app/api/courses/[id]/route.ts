import { authedRoute } from '@/server/http/handler'
import { parseBody } from '@/server/http/request'
import { ok } from '@/server/http/response'
import { archiveCourse, getCourseDetail, updateCourse } from '@/server/modules/courses/service'
import { courseUpdateSchema } from '@/shared/schemas'

type Params = { id: string }

// GET /api/courses/[id] — course page: curriculum, own progress, assessments, certificate.
export const GET = authedRoute<Params>(async (_req, { user, params }) => ok(await getCourseDetail(user, params.id)))

export const PATCH = authedRoute<Params>(async (req, { user, params }) =>
  ok(await updateCourse(user, params.id, await parseBody(req, courseUpdateSchema), req))
)

// DELETE /api/courses/[id] — archive (courses with learner history are never hard-deleted).
export const DELETE = authedRoute<Params>(async (req, { user, params }) => {
  await archiveCourse(user, params.id, req)
  return ok({ archived: true })
})
