import { authedRoute } from '@/server/http/handler'
import { parseBody } from '@/server/http/request'
import { ok } from '@/server/http/response'
import { createLesson } from '@/server/modules/courses/curriculum'
import { lessonInputSchema } from '@/shared/schemas'

export const POST = authedRoute<{ id: string }>(async (req, { user, params }) =>
  ok(await createLesson(user, params.id, await parseBody(req, lessonInputSchema), req))
)
