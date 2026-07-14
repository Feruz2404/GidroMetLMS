import { PrismaClient } from '@prisma/client'
import { getProductionContentCounts, getProductionContentDuplicateReport } from './production-content-report'

const prisma = new PrismaClient()

function assertInspectionAllowed() {
  if (process.env.ALLOW_PRODUCTION_CONTENT_INSPECT !== 'true') {
    throw new Error('Production content inspection is not authorized.')
  }
  if (process.env.VERCEL_ENV !== 'production' && process.env.CONTENT_INIT_ISOLATED_TEST !== 'true') {
    throw new Error('Inspection requires VERCEL_ENV=production or the explicit isolated-test guard.')
  }
  if (!/^postgres(?:ql)?:\/\//i.test(process.env.DATABASE_URL?.trim() ?? '')) {
    throw new Error('A PostgreSQL DATABASE_URL is required for production content inspection.')
  }
}

async function main() {
  assertInspectionAllowed()
  const [counts, duplicates] = await Promise.all([
    getProductionContentCounts(prisma),
    getProductionContentDuplicateReport(prisma),
  ])
  console.warn(JSON.stringify({ phase: 'inspection', counts, duplicates }))
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : 'Production content inspection failed.')
    process.exitCode = 1
  })
  .finally(async () => prisma.$disconnect())
