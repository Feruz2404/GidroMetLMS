interface Entry {
  count: number
  resetAt: number
}

const globalForRateLimit = globalThis as unknown as { loginRateLimits?: Map<string, Entry> }
const entries = globalForRateLimit.loginRateLimits ?? new Map<string, Entry>()
globalForRateLimit.loginRateLimits = entries

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  retryAfterSeconds: number
}

export function consumeRateLimit(key: string, limit = 5, windowMs = 15 * 60 * 1000, now = Date.now()): RateLimitResult {
  const current = entries.get(key)
  const entry = !current || current.resetAt <= now ? { count: 0, resetAt: now + windowMs } : current
  entry.count += 1
  entries.set(key, entry)

  if (entries.size > 10_000) {
    for (const [candidate, value] of entries) {
      if (value.resetAt <= now) entries.delete(candidate)
    }
  }

  return {
    allowed: entry.count <= limit,
    remaining: Math.max(0, limit - entry.count),
    retryAfterSeconds: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
  }
}

export function resetRateLimit(key: string) {
  entries.delete(key)
}
