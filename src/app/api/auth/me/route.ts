import { authedRoute } from '@/server/http/handler'
import { parseBody } from '@/server/http/request'
import { ok } from '@/server/http/response'
import { updateProfile } from '@/server/modules/auth/service'
import { toCurrentUser } from '@/server/modules/users/mapper'
import { profileUpdateSchema } from '@/shared/schemas'

// GET /api/auth/me — the signed-in user.
export const GET = authedRoute(async (_req, { user }) => ok(toCurrentUser(user)))

// PATCH /api/auth/me — update own profile fields.
export const PATCH = authedRoute(async (req, { user }) => ok(await updateProfile(user, await parseBody(req, profileUpdateSchema))))
