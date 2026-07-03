type LogLevel = 'info' | 'warn' | 'error'

const REDACTED_KEY_RE = /(secret|token|password|authorization|cookie|database_url|direct_url|postgres)/i

function sanitize(value: unknown, key = ''): unknown {
  if (REDACTED_KEY_RE.test(key)) return '[redacted]'
  if (value instanceof Error) {
    const errorWithCode = value as Error & { code?: unknown }
    return {
      name: value.name,
      message: value.message,
      ...(typeof errorWithCode.code === 'string' ? { code: errorWithCode.code } : {}),
      ...(process.env.NODE_ENV !== 'production' && value.stack ? { stack: value.stack } : {}),
    }
  }
  if (Array.isArray(value)) return value.map((item) => sanitize(item))
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([childKey, childValue]) => [
        childKey,
        sanitize(childValue, childKey),
      ])
    )
  }
  return value
}

export function logServerEvent(level: LogLevel, context: string, meta: Record<string, unknown> = {}) {
  const sanitizedMeta = sanitize(meta) as Record<string, unknown>
  const payload = {
    level,
    context,
    timestamp: new Date().toISOString(),
    ...sanitizedMeta,
  }
  const line = JSON.stringify(payload)
  if (level === 'error') console.error(line)
  else if (level === 'warn') console.warn(line)
  else console.warn(line)
}

export function logServerError(context: string, error: unknown, meta: Record<string, unknown> = {}) {
  logServerEvent('error', context, { ...meta, error })
}
