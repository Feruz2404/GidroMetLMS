import { z } from 'zod'
import { authedRoute } from '@/server/http/handler'
import { paginationQuery, parseBody, parseQuery } from '@/server/http/request'
import { ok } from '@/server/http/response'
import { createCourse, listCourses } from '@/server/modules/courses/service'
import { courseInputSchema } from '@/shared/schemas'

const listQuery = z.object({
  ...paginationQuery,
  search: z.string().trim().max(100).optional(),
  categoryId: z.string().max(60).optional(),
  level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  view: z.enum(['all', 'enrolled', 'completed', 'managed']).catch('all').default('all'),
  sort: z.enum(['newest', 'popular', 'title']).catch('newest').default('newest'),
})

// GET /api/courses — catalogue filtered to what the caller may see.
export const GET = authedRoute(async (req, { user }) => {
  const { items, meta } = await listCourses(user, parseQuery(req, listQuery))
  return ok(items, meta)
})

// POST /api/courses — create a draft course.
export const POST = authedRoute(async (req, { user }) => ok(await createCourse(user, await parseBody(req, courseInputSchema), req)))
