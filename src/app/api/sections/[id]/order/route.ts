import { authedRoute } from '@/server/http/handler'
import { parseBody } from '@/server/http/request'
import { ok } from '@/server/http/response'
import { reorderLessons } from '@/server/modules/courses/curriculum'
import { reorderSchema } from '@/shared/schemas'

// PUT /api/sections/[id]/order — reorder the lessons of a section.
export const PUT = authedRoute<{ id: string }>(async (req, { user, params }) => {
  const { ids } = await parseBody(req, reorderSchema)
  await reorderLessons(user, params.id, ids)
  return ok({ reordered: ids.length })
})
