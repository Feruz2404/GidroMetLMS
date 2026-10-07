import { z } from 'zod'
import { authedRoute } from '@/server/http/handler'
import { parseBody } from '@/server/http/request'
import { ok } from '@/server/http/response'
import { getCertificate, revokeCertificate } from '@/server/modules/certificates/service'

type Params = { id: string }

const revokeBody = z.object({ status: z.literal('revoked'), reason: z.string().trim().max(500).nullish() })

export const GET = authedRoute<Params>(async (_req, { user, params }) => ok(await getCertificate(user, params.id)))

// PATCH /api/certificates/[id] — revoke ({ status: 'revoked', reason? }).
export const PATCH = authedRoute<Params>(async (req, { user, params }) => {
  const { reason } = await parseBody(req, revokeBody)
  return ok(await revokeCertificate(user, params.id, reason ?? null, req))
})
