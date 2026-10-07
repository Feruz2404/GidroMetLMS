import { authedRoute } from '@/server/http/handler'
import { parseBody } from '@/server/http/request'
import { ok } from '@/server/http/response'
import { issueCertificate } from '@/server/modules/certificates/service'
import { issueCertificateSchema } from '@/shared/schemas'

// POST /api/certificates/generate — issue a certificate for one learner (eligibility re-checked on the server).
export const POST = authedRoute(async (req, { user }) => ok(await issueCertificate(user, await parseBody(req, issueCertificateSchema), req)))
