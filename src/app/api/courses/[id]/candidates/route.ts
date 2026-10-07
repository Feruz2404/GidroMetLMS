import { z } from 'zod'
import { authedRoute } from '@/server/http/handler'
import { parseQuery } from '@/server/http/request'
import { ok } from '@/server/http/response'
import { searchAssignableLearners } from '@/server/modules/courses/service'

const query = z.object({ search: z.string().trim().max(100).default('') })

// GET /api/courses/[id]/candidates?search= — learners the course manager may assign individually.
export const GET = authedRoute<{ id: string }>(async (req, { user, params }) =>
  ok(await searchAssignableLearners(user, params.id, parseQuery(req, query).search))
)
