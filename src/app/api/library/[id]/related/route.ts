import { authedRoute } from '@/server/http/handler'
import { ok } from '@/server/http/response'
import { getRelatedResources } from '@/server/modules/library/service'

export const GET = authedRoute<{ id: string }>(async (_req, { user, params }) => ok(await getRelatedResources(user, params.id)))
