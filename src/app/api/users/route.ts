import { z } from 'zod'
import { authedRoute } from '@/server/http/handler'
import { paginationQuery, parseBody, parseQuery } from '@/server/http/request'
import { ok } from '@/server/http/response'
import { createUser, listUsers } from '@/server/modules/users/service'
import { createUserSchema } from '@/shared/schemas'

const listQuery = z.object({
  ...paginationQuery,
  limit: z.coerce.number().int().min(1).max(100).catch(20).default(20),
  search: z.string().trim().max(100).optional(),
  role: z.string().max(40).optional(),
  status: z.enum(['active', 'inactive']).optional(),
  department: z.string().max(120).optional(),
})

// GET /api/users — administrator user directory.
export const GET = authedRoute(async (req, { user }) => {
  const { items, meta } = await listUsers(user, parseQuery(req, listQuery))
  return ok(items, meta)
})

// POST /api/users — provision an account with a temporary password.
export const POST = authedRoute(async (req, { user }) => ok(await createUser(user, await parseBody(req, createUserSchema), req)))
