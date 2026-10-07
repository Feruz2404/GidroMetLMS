import type { NextRequest } from 'next/server'
import { ZodError } from 'zod'
import { getPrismaErrorDetails, ServerConfigError } from '@/server/db'
import { AuthConfigError, findSessionUser, getRequestToken, isTrustedRequest, type SessionUser } from '@/server/auth/session'
import { logServerError } from '@/server/log'
import { AppError, unauthorized } from './errors'
import { formatIssues } from './request'
import { fail } from './response'

type Params = Record<string, string>
type RouteContext<P extends Params> = { params: Promise<P> }

export interface PublicContext<P extends Params> {
  params: P
}

export interface AuthedContext<P extends Params> extends PublicContext<P> {
  user: SessionUser
}

function toErrorResponse(error: unknown, req: Request): Response {
  if (error instanceof AppError) return fail(error.status, error.code, error.message, error.details)
  if (error instanceof ZodError) return fail(400, 'VALIDATION_FAILED', 'Invalid request', formatIssues(error))

  const context = `${req.method} ${new URL(req.url).pathname}`
  const prisma = getPrismaErrorDetails(error)
  if (prisma.code === 'P2002') return fail(409, 'CONFLICT', 'A record with the same unique value already exists')
  if (prisma.code === 'P2025') return fail(404, 'NOT_FOUND', 'Record not found')
  if (error instanceof AuthConfigError || error instanceof ServerConfigError || prisma.isConfigIssue) {
    logServerError(context, error, { category: 'configuration' })
    return fail(503, 'SERVER_CONFIG_ERROR', 'Server configuration error')
  }
  if (prisma.isConnectionIssue || prisma.isSchemaIssue) {
    logServerError(context, error, { category: 'database', code: prisma.code })
    return fail(503, 'DATABASE_UNAVAILABLE', 'Database unavailable')
  }
  logServerError(context, error, { category: 'unhandled', code: prisma.code })
  return fail(500, 'INTERNAL_ERROR', 'Unexpected server error')
}

/** Resolves the authenticated user, enforcing the same-origin rule for cookie mutations. */
export async function getRequestUser(req: Request): Promise<SessionUser | null> {
  const { token, source } = getRequestToken(req)
  if (source === 'cookie' && !isTrustedRequest(req)) return null
  return findSessionUser(token)
}

export async function requireRequestUser(req: Request): Promise<SessionUser> {
  const user = await getRequestUser(req)
  if (!user) throw unauthorized()
  return user
}

/** Wraps a public route handler with uniform error handling. */
export function publicRoute<P extends Params = Params>(
  handler: (req: NextRequest, ctx: PublicContext<P>) => Promise<Response>
) {
  return async (req: NextRequest, context: RouteContext<P>): Promise<Response> => {
    try {
      return await handler(req, { params: await context.params })
    } catch (error) {
      return toErrorResponse(error, req)
    }
  }
}

/** Wraps a route handler that requires an authenticated session. Authorization stays in the services. */
export function authedRoute<P extends Params = Params>(
  handler: (req: NextRequest, ctx: AuthedContext<P>) => Promise<Response>
) {
  return publicRoute<P>(async (req, ctx) => handler(req, { ...ctx, user: await requireRequestUser(req) }))
}
