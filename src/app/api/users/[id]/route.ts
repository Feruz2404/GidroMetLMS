import { authedRoute } from '@/server/http/handler'
import { parseBody } from '@/server/http/request'
import { ok } from '@/server/http/response'
import { getUser, setUserActive, updateUser } from '@/server/modules/users/service'
import { updateUserSchema } from '@/shared/schemas'

type Params = { id: string }

export const GET = authedRoute<Params>(async (_req, { user, params }) => ok(await getUser(user, params.id)))

export const PATCH = authedRoute<Params>(async (req, { user, params }) =>
  ok(await updateUser(user, params.id, await parseBody(req, updateUserSchema), req))
)

// DELETE /api/users/[id] — accounts are never hard-deleted; this deactivates and signs out.
export const DELETE = authedRoute<Params>(async (req, { user, params }) => ok(await setUserActive(user, params.id, false, req)))
