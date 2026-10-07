import { z } from 'zod'
import { authedRoute } from '@/server/http/handler'
import { parseBody } from '@/server/http/request'
import { ok } from '@/server/http/response'
import { assignCourse } from '@/server/modules/courses/service'

const body = z.object({
  userIds: z.array(z.string().min(1)).max(1000).optional(),
  department: z.string().trim().min(1).max(120).optional(),
  deadlineAt: z.coerce.date().nullish(),
})

// POST /api/courses/[id]/assign — assign a course to learners or a department, optionally with a deadline.
export const POST = authedRoute<{ id: string }>(async (req, { user, params }) =>
  ok(await assignCourse(user, params.id, await parseBody(req, body), req))
)
