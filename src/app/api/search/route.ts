import { z } from 'zod'
import { authedRoute } from '@/server/http/handler'
import { parseQuery } from '@/server/http/request'
import { ok } from '@/server/http/response'
import { search } from '@/server/modules/search/service'

const query = z.object({ q: z.string().trim().max(100).default('') })

// GET /api/search?q= — quick search for the command palette.
export const GET = authedRoute(async (req, { user }) => ok(await search(user, parseQuery(req, query).q)))
