import { authedRoute } from '@/server/http/handler'
import { parseBody } from '@/server/http/request'
import { ok } from '@/server/http/response'
import { archiveResource, getResource, updateResource } from '@/server/modules/library/service'
import { resourceUpdateSchema } from '@/shared/schemas'

type Params = { id: string }

export const GET = authedRoute<Params>(async (_req, { user, params }) => ok(await getResource(user, params.id)))

export const PATCH = authedRoute<Params>(async (req, { user, params }) =>
  ok(await updateResource(user, params.id, await parseBody(req, resourceUpdateSchema), req))
)

export const DELETE = authedRoute<Params>(async (req, { user, params }) => {
  await archiveResource(user, params.id, req)
  return ok({ archived: true })
})
