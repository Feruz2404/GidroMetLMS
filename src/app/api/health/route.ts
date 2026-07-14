import { db, getDatabaseConfigStatus, getPrismaErrorDetails } from '@/lib/db'
import { isSessionSecretConfigured } from '@/lib/auth'
import { logServerError } from '@/lib/server-log'
import { getDeploymentEnvironment, resolveApplicationUrl } from '@/lib/environment'

export async function GET() {
  const databaseConfig = getDatabaseConfigStatus()
  const sessionSecretConfigured = isSessionSecretConfigured()
  const deploymentEnvironment = getDeploymentEnvironment()
  const applicationUrlConfigured = Boolean(resolveApplicationUrl())
  let databaseReachable = false
  let databaseErrorCode: string | null = null

  const canCheckDatabase =
    databaseConfig.databaseUrlConfigured &&
    databaseConfig.databaseUrlSupported &&
    (!databaseConfig.productionRequiresPostgres || databaseConfig.databaseUrlProductionReady)

  if (canCheckDatabase) {
    try {
      await db.$queryRaw`SELECT 1`
      databaseReachable = true
    } catch (e) {
      const details = getPrismaErrorDetails(e)
      databaseErrorCode = details.code ?? 'DATABASE_CHECK_FAILED'
      logServerError('health.database', e, { code: databaseErrorCode })
    }
  }

  const healthy =
    databaseConfig.databaseUrlConfigured &&
    databaseConfig.databaseUrlSupported &&
    (!databaseConfig.productionRequiresPostgres || databaseConfig.databaseUrlProductionReady) &&
    sessionSecretConfigured &&
    applicationUrlConfigured &&
    databaseReachable

  const response = Response.json(
    {
      status: healthy ? 'ok' : 'degraded',
      checks: {
        app: true,
        databaseReachable,
        databaseErrorCode,
        env: {
          databaseUrlConfigured: databaseConfig.databaseUrlConfigured,
          databaseUrlSource: databaseConfig.databaseUrlSource,
          databaseUrlSupported: databaseConfig.databaseUrlSupported,
          databaseUrlProductionReady: databaseConfig.databaseUrlProductionReady,
          productionRequiresPostgres: databaseConfig.productionRequiresPostgres,
          directUrlConfigured: databaseConfig.directUrlConfigured,
          sessionSecretConfigured,
          applicationUrlConfigured,
          deploymentEnvironment,
        },
      },
      timestamp: new Date().toISOString(),
    },
    { status: healthy ? 200 : 503 }
  )
  response.headers.set('Cache-Control', 'no-store, max-age=0')
  return response
}

export const dynamic = 'force-dynamic'
