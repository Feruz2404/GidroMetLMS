import { z } from 'zod'
import { authedRoute } from '@/server/http/handler'
import { parseBody } from '@/server/http/request'
import { ok } from '@/server/http/response'
import { setUserActive } from '@/server/modules/users/service'

const body = z.object({ isActive: z.boolean() })

// PATCH /api/users/[id]/status — activate or block an account.
export const PATCH = authedRoute<{ id: string }>(async (req, { user, params }) => {
  const { isActive } = await parseBody(req, body)
  return ok(await setUserActive(user, params.id, isActive, req))
})
