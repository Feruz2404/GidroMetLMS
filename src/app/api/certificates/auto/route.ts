import { authedRoute } from '@/server/http/handler'
import { ok } from '@/server/http/response'
import { syncCertificates } from '@/server/modules/certificates/service'

// POST /api/certificates/auto — issue certificates to every eligible learner that has none.
export const POST = authedRoute(async (req, { user }) => ok(await syncCertificates(user, req)))
