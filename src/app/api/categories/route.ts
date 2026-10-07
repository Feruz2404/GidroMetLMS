import { authedRoute } from '@/server/http/handler'
import { ok } from '@/server/http/response'
import { listCategories } from '@/server/modules/courses/service'

// GET /api/categories — active categories with the number of courses visible to the caller.
export const GET = authedRoute(async (_req, { user }) => ok(await listCategories(user)))
