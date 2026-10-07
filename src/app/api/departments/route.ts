import { authedRoute } from '@/server/http/handler'
import { ok } from '@/server/http/response'
import { listDepartments } from '@/server/modules/users/service'

export const GET = authedRoute(async () => ok(await listDepartments()))
