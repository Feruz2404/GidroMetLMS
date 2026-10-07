import { z } from 'zod'
import { publicRoute } from '@/server/http/handler'
import { parseQuery } from '@/server/http/request'
import { ok } from '@/server/http/response'
import { verifyCertificate } from '@/server/modules/certificates/service'

const query = z.object({ hash: z.string().trim().max(64) })

// GET /api/certificates/verify?hash= — public verification; exposes no contact data.
export const GET = publicRoute(async (req) => ok(await verifyCertificate(parseQuery(req, query).hash)))
