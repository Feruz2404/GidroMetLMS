import { authedRoute } from '@/server/http/handler'
import { ok } from '@/server/http/response'
import { getDashboard } from '@/server/modules/analytics/dashboard'

// GET /api/dashboard — role-specific home page data.
export const GET = authedRoute(async (_req, { user }) => ok(await getDashboard(user)))
