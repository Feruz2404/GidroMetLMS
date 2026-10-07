import { authedRoute } from '@/server/http/handler'
import { ok } from '@/server/http/response'
import { toggleBookmark } from '@/server/modules/library/service'

// POST /api/library/[id]/bookmark — toggle the caller's bookmark.
export const POST = authedRoute<{ id: string }>(async (_req, { user, params }) => ok(await toggleBookmark(user, params.id)))
