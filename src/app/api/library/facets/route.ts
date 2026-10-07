import { authedRoute } from '@/server/http/handler'
import { ok } from '@/server/http/response'
import { getFacets } from '@/server/modules/library/service'

// GET /api/library/facets — filter options with counts.
export const GET = authedRoute(async () => ok(await getFacets()))
