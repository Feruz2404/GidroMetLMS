import { publicRoute } from '@/server/http/handler'
import { ok } from '@/server/http/response'

// GET /api — liveness probe (readiness lives at /api/health).
export const GET = publicRoute(async () => ok({ status: 'ok', timestamp: new Date().toISOString() }))
