import { authedRoute } from '@/server/http/handler'
import { ok } from '@/server/http/response'
import { markRead, removeNotification } from '@/server/modules/notifications/service'

type Params = { id: string }

export const PATCH = authedRoute<Params>(async (_req, { user, params }) => ok(await markRead(user.id, params.id)))

export const DELETE = authedRoute<Params>(async (_req, { user, params }) => {
  await removeNotification(user.id, params.id)
  return ok({ deleted: true })
})
