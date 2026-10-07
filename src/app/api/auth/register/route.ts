import { publicRoute } from '@/server/http/handler'
import { parseBody } from '@/server/http/request'
import { ok } from '@/server/http/response'
import { withSessionCookie } from '@/server/auth/session'
import { isRegistrationOpen, register } from '@/server/modules/auth/service'
import { registrationSchema } from '@/shared/schemas'

// GET /api/auth/register — whether self-registration is open (drives the login page link).
export const GET = publicRoute(async () => ok({ open: isRegistrationOpen() }))

// POST /api/auth/register — learner self-registration (when enabled).
export const POST = publicRoute(async (req) => {
  const { user, token } = await register(await parseBody(req, registrationSchema), req)
  return withSessionCookie(ok(user), token)
})
