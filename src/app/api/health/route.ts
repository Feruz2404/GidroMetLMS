import { isSessionSecretConfigured } from '@/server/auth/session'
import { getDeploymentEnvironment, resolveApplicationUrl } from '@/server/config/environment'
import { db, getDatabaseConfigStatus, getPrismaErrorDetails } from '@/server/db'
import { logServerError } from '@/server/log'

// GET /api/health — readiness: configuration and database reachability, never secret values.
export async function GET() {
  const database = getDatabaseConfigStatus()
  const sessionSecretConfigured = isSessionSecretConfigured()
  const applicationUrlConfigured = Boolean(resolveApplicationUrl())
  let databaseReachable = false
  let databaseErrorCode: string | null = null

  if (database.databaseUrlConfigured && database.databaseUrlSupported) {
    try {
      await db.$queryRaw`SELECT 1`
      databaseReachable = true
    } catch (error) {
      databaseErrorCode = getPrismaErrorDetails(error).code ?? 'DATABASE_CHECK_FAILED'
      logServerError('health.database', error, { code: databaseErrorCode })
    }
  }

  const healthy = databaseReachable && sessionSecretConfigured && applicationUrlConfigured
  return Response.json(
    {
      status: healthy ? 'ok' : 'degraded',
      checks: {
        app: true,
        databaseReachable,
        databaseErrorCode,
        env: { ...database, sessionSecretConfigured, applicationUrlConfigured, deploymentEnvironment: getDeploymentEnvironment() },
      },
      timestamp: new Date().toISOString(),
    },
    { status: healthy ? 200 : 503, headers: { 'Cache-Control': 'no-store, max-age=0' } }
  )
}

export const dynamic = 'force-dynamic'
