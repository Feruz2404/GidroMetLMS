import { z } from 'zod'
import { authedRoute } from '@/server/http/handler'
import { parseQuery } from '@/server/http/request'
import { csv, ok } from '@/server/http/response'
import { buildReport } from '@/server/modules/analytics/reports'

const query = z.object({
  type: z.enum(['overview', 'learners', 'courses', 'assessments', 'certificates', 'library', 'audit']).catch('overview').default('overview'),
  format: z.enum(['json', 'csv']).catch('json').default('json'),
})

// GET /api/reports?type=…&format=json|csv — scoped analytics; tabular reports export to CSV.
export const GET = authedRoute(async (req, { user }) => {
  const { type, format } = parseQuery(req, query)
  const report = await buildReport(user, type)
  if (format === 'csv' && Array.isArray(report)) {
    return csv(`gidroedu-${type}-${new Date().toISOString().slice(0, 10)}.csv`, report as unknown as Array<Record<string, unknown>>)
  }
  return ok(report)
})
