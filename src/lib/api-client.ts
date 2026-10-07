// Typed fetch wrapper for the /api routes. Sessions travel in an HttpOnly
// cookie, so the client never stores or sends tokens itself.
import type { ApiErrorBody, ErrorCode, FieldIssue, PageMeta } from '@/shared/error-codes'

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: ErrorCode | 'NETWORK',
    message: string,
    readonly details?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }

  /** Field-level validation issues, when the server returned them. */
  get issues(): FieldIssue[] {
    return Array.isArray(this.details) ? (this.details as FieldIssue[]) : []
  }
}

export interface Page<T> {
  items: T[]
  meta: PageMeta
}

type Query = Record<string, string | number | boolean | null | undefined>

let unauthorizedHandler: (() => void) | null = null

/** Registered once by the app providers; called when any request returns 401. */
export function onUnauthorized(handler: () => void) {
  unauthorizedHandler = handler
}

export function buildQuery(query?: Query): string {
  if (!query) return ''
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === '') continue
    params.set(key, String(value))
  }
  const text = params.toString()
  return text ? `?${text}` : ''
}

async function request<T>(method: string, path: string, options: { body?: unknown; query?: Query } = {}): Promise<{ data: T; meta?: PageMeta }> {
  let response: Response
  try {
    response = await fetch(`/api${path}${buildQuery(options.query)}`, {
      method,
      credentials: 'same-origin',
      cache: 'no-store',
      headers: options.body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    })
  } catch {
    throw new ApiError(0, 'NETWORK', 'Network error')
  }

  const payload = (await response.json().catch(() => null)) as
    | { status: 'success'; data: T; meta?: PageMeta }
    | ApiErrorBody
    | null

  if (!response.ok || !payload || payload.status !== 'success') {
    const error = payload && payload.status === 'error' ? payload : null
    if (response.status === 401 && unauthorizedHandler) unauthorizedHandler()
    throw new ApiError(response.status, error?.code ?? 'INTERNAL_ERROR', error?.message ?? `HTTP ${response.status}`, error?.details)
  }
  return { data: payload.data, meta: payload.meta }
}

export const api = {
  get: async <T>(path: string, query?: Query) => (await request<T>('GET', path, { query })).data,
  page: async <T>(path: string, query?: Query): Promise<Page<T>> => {
    const { data, meta } = await request<T[]>('GET', path, { query })
    return { items: data, meta: meta ?? { total: data.length, page: 1, pages: 1, limit: data.length } }
  },
  post: async <T>(path: string, body: unknown = {}) => (await request<T>('POST', path, { body })).data,
  patch: async <T>(path: string, body: unknown) => (await request<T>('PATCH', path, { body })).data,
  put: async <T>(path: string, body: unknown) => (await request<T>('PUT', path, { body })).data,
  delete: async <T>(path: string) => (await request<T>('DELETE', path)).data,
}

/** Absolute URL of a CSV export, for use as a download link. */
export function exportUrl(path: string, query?: Query): string {
  return `/api${path}${buildQuery({ ...query, format: 'csv' })}`
}
