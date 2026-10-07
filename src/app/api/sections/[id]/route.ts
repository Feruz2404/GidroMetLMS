import { authedRoute } from '@/server/http/handler'
import { parseBody } from '@/server/http/request'
import { ok } from '@/server/http/response'
import { deleteSection, updateSection } from '@/server/modules/courses/curriculum'
import { sectionInputSchema } from '@/shared/schemas'

type Params = { id: string }

export const PATCH = authedRoute<Params>(async (req, { user, params }) =>
  ok(await updateSection(user, params.id, await parseBody(req, sectionInputSchema.partial())))
)

export const DELETE = authedRoute<Params>(async (req, { user, params }) => {
  await deleteSection(user, params.id, req)
  return ok({ deleted: true })
})
