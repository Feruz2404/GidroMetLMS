import { z } from 'zod'
import { authedRoute } from '@/server/http/handler'
import { paginationQuery, parseQuery } from '@/server/http/request'
import { ok } from '@/server/http/response'
import { listCertificates } from '@/server/modules/certificates/service'

const listQuery = z.object({
  ...paginationQuery,
  search: z.string().trim().max(100).optional(),
  courseId: z.string().max(60).optional(),
  status: z.enum(['active', 'revoked', 'expired']).optional(),
  mine: z.enum(['true', 'false']).transform((value) => value === 'true').optional(),
})

// GET /api/certificates — own certificates for learners; scoped registry for staff.
export const GET = authedRoute(async (req, { user }) => {
  const { items, meta } = await listCertificates(user, parseQuery(req, listQuery))
  return ok(items, meta)
})
