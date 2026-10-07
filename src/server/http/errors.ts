import type { ErrorCode } from '@/shared/error-codes'

/**
 * An expected, client-facing failure. Services throw these; the route handler
 * wrapper turns them into a JSON error response with the matching status.
 */
export class AppError extends Error {
  constructor(
    readonly status: number,
    readonly code: ErrorCode,
    message?: string,
    readonly details?: unknown
  ) {
    super(message ?? code)
    this.name = 'AppError'
  }
}

export const badRequest = (code: ErrorCode = 'BAD_REQUEST', message?: string, details?: unknown) =>
  new AppError(400, code, message, details)
export const unauthorized = () => new AppError(401, 'UNAUTHORIZED', 'Authentication required')
export const forbidden = (code: ErrorCode = 'FORBIDDEN', message = 'Permission denied') => new AppError(403, code, message)
export const notFound = (what = 'Resource') => new AppError(404, 'NOT_FOUND', `${what} not found`)
export const conflict = (code: ErrorCode = 'CONFLICT', message?: string, details?: unknown) =>
  new AppError(409, code, message, details)
export const unprocessable = (code: ErrorCode, message?: string, details?: unknown) =>
  new AppError(422, code, message, details)

/** Throws `notFound` when the value is null/undefined; narrows the type otherwise. */
export function found<T>(value: T | null | undefined, what?: string): T {
  if (value === null || value === undefined) throw notFound(what)
  return value
}
