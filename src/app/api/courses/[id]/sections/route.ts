import { authedRoute } from '@/server/http/handler'
import { parseBody } from '@/server/http/request'
import { ok } from '@/server/http/response'
import { createSection, reorderSections } from '@/server/modules/courses/curriculum'
import { reorderSchema, sectionInputSchema } from '@/shared/schemas'

type Params = { id: string }

export const POST = authedRoute<Params>(async (req, { user, params }) =>
  ok(await createSection(user, params.id, await parseBody(req, sectionInputSchema), req))
)

// PUT /api/courses/[id]/sections — reorder sections ({ ids } in the new order).
export const PUT = authedRoute<Params>(async (req, { user, params }) => {
  const { ids } = await parseBody(req, reorderSchema)
  await reorderSections(user, params.id, ids)
  return ok({ reordered: ids.length })
})
