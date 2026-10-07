import { z } from 'zod'
import { authedRoute } from '@/server/http/handler'
import { parseQuery } from '@/server/http/request'
import { ok } from '@/server/http/response'
import { listNotifications, markAllRead } from '@/server/modules/notifications/service'

const listQuery = z.object({
  filter: z.enum(['all', 'unread']).catch('all').default('all'),
  limit: z.coerce.number().int().min(1).max(100).catch(50).default(50),
})

export const GET = authedRoute(async (req, { user }) => {
  const { filter, limit } = parseQuery(req, listQuery)
  return ok(await listNotifications(user.id, { unreadOnly: filter === 'unread', limit }))
})

// POST /api/notifications — mark all as read.
export const POST = authedRoute(async (_req, { user }) => ok(await markAllRead(user.id)))
