import { z } from 'zod'
import { authedRoute } from '@/server/http/handler'
import { paginationQuery, parseBody, parseQuery } from '@/server/http/request'
import { ok } from '@/server/http/response'
import { createResource, listResources } from '@/server/modules/library/service'
import { resourceInputSchema } from '@/shared/schemas'

const listQuery = z.object({
  ...paginationQuery,
  search: z.string().trim().max(100).optional(),
  type: z.string().max(30).optional(),
  category: z.string().max(120).optional(),
  language: z.enum(['uz', 'ru', 'en']).optional(),
  year: z.coerce.number().int().min(1900).max(2100).optional().catch(undefined),
  status: z.enum(['active', 'archived']).optional(),
  bookmarked: z.enum(['true', 'false']).transform((value) => value === 'true').optional(),
  sort: z.enum(['newest', 'popular', 'downloads', 'title', 'year']).catch('newest').default('newest'),
})

export const GET = authedRoute(async (req, { user }) => {
  const { items, meta } = await listResources(user, parseQuery(req, listQuery))
  return ok(items, meta)
})

export const POST = authedRoute(async (req, { user }) => ok(await createResource(user, await parseBody(req, resourceInputSchema), req)))
