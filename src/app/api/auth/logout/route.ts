import { getRequestUser, publicRoute } from '@/server/http/handler'
import { ok } from '@/server/http/response'
import { getRequestToken, withExpiredSessionCookie } from '@/server/auth/session'
import { logout } from '@/server/modules/auth/service'

// POST /api/auth/logout — sign out (alias of DELETE /api/auth).
export const POST = publicRoute(async (req) => {
  await logout(await getRequestUser(req), getRequestToken(req).token, req)
  return withExpiredSessionCookie(ok({ signedOut: true }))
})
