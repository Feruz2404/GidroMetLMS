import { authedRoute } from '@/server/http/handler'
import { parseBody } from '@/server/http/request'
import { ok } from '@/server/http/response'
import { deleteLesson, getLesson, updateLesson } from '@/server/modules/courses/curriculum'
import { lessonUpdateSchema } from '@/shared/schemas'

type Params = { id: string }

// GET /api/lessons/[id] — lesson content with navigation; locked for non-enrolled learners.
export const GET = authedRoute<Params>(async (_req, { user, params }) => ok(await getLesson(user, params.id)))

export const PATCH = authedRoute<Params>(async (req, { user, params }) =>
  ok(await updateLesson(user, params.id, await parseBody(req, lessonUpdateSchema), req))
)

export const DELETE = authedRoute<Params>(async (req, { user, params }) => {
  await deleteLesson(user, params.id, req)
  return ok({ deleted: true })
})
