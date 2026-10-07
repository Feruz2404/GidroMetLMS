import { authedRoute } from '@/server/http/handler'
import { parseBody } from '@/server/http/request'
import { ok } from '@/server/http/response'
import { getRequestToken } from '@/server/auth/session'
import { changePassword } from '@/server/modules/auth/service'
import { changePasswordSchema } from '@/shared/schemas'

// POST /api/auth/password — change own password; other sessions are signed out.
export const POST = authedRoute(async (req, { user }) =>
  ok(await changePassword(user, await parseBody(req, changePasswordSchema), getRequestToken(req).token, req))
)
