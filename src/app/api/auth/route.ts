import { getRequestUser, publicRoute } from '@/server/http/handler'
import { parseBody } from '@/server/http/request'
import { ok } from '@/server/http/response'
import { getRequestToken, withExpiredSessionCookie, withSessionCookie } from '@/server/auth/session'
import { login, logout } from '@/server/modules/auth/service'
import { loginSchema } from '@/shared/schemas'

// POST /api/auth — sign in; the session token is only ever sent as an HttpOnly cookie.
export const POST = publicRoute(async (req) => {
  const { user, token } = await login(await parseBody(req, loginSchema), req)
  return withSessionCookie(ok(user), token)
})

// DELETE /api/auth — sign out.
export const DELETE = publicRoute(async (req) => {
  await logout(await getRequestUser(req), getRequestToken(req).token, req)
  return withExpiredSessionCookie(ok({ signedOut: true }))
})
