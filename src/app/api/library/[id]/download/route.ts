import { authedRoute } from '@/server/http/handler'
import { ok } from '@/server/http/response'
import { registerDownload } from '@/server/modules/library/service'

// POST /api/library/[id]/download — count the download and return the vetted file URL.
export const POST = authedRoute<{ id: string }>(async (req, { user, params }) => ok(await registerDownload(user, params.id, req)))
