import { authedRoute } from '@/server/http/handler'
import { parseBody } from '@/server/http/request'
import { ok } from '@/server/http/response'
import { resetUserPassword } from '@/server/modules/users/service'
import { resetPasswordSchema } from '@/shared/schemas'

// POST /api/users/[id]/password — set a temporary password; the user must change it at next sign-in.
export const POST = authedRoute<{ id: string }>(async (req, { user, params }) => {
  const { password } = await parseBody(req, resetPasswordSchema)
  return ok(await resetUserPassword(user, params.id, password, req))
})
