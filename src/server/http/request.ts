import { z } from 'zod'
import type { FieldIssue, PageMeta } from '@/shared/error-codes'
import { badRequest } from './errors'

export function formatIssues(error: z.ZodError): FieldIssue[] {
  return error.issues.map((issue) => ({ path: issue.path.join('.'), message: issue.message }))
}

function validate<S extends z.ZodType>(schema: S, input: unknown): z.output<S> {
  const parsed = schema.safeParse(input)
  if (!parsed.success) throw badRequest('VALIDATION_FAILED', 'Invalid request', formatIssues(parsed.error))
  return parsed.data
}

/** Parses and validates a JSON body. Malformed JSON is a 400, never a 500. */
export async function parseBody<S extends z.ZodType>(req: Request, schema: S): Promise<z.output<S>> {
  let body: unknown
  try {
    const text = await req.text()
    body = text ? JSON.parse(text) : {}
  } catch {
    throw badRequest('BAD_REQUEST', 'Malformed JSON body')
  }
  return validate(schema, body)
}

/** Validates URL search params. Repeated keys are ignored; the first value wins. */
export function parseQuery<S extends z.ZodType>(req: Request, schema: S): z.output<S> {
  const params = new URL(req.url).searchParams
  const query: Record<string, string> = {}
  for (const [key, value] of params) {
    if (!(key in query) && value !== '') query[key] = value
  }
  return validate(schema, query)
}

export const paginationQuery = {
  page: z.coerce.number().int().min(1).catch(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).catch(12).default(12),
}

export function pageMeta(total: number, page: number, limit: number): PageMeta {
  return { total, page, limit, pages: Math.max(1, Math.ceil(total / limit)) }
}

export function skipTake(page: number, limit: number) {
  return { skip: (page - 1) * limit, take: limit }
}

/** Case-insensitive `contains` filter for PostgreSQL text columns. */
export function ilike(value: string) {
  return { contains: value, mode: 'insensitive' as const }
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim().slice(0, 64)
  return (req.headers.get('x-real-ip') || 'unknown').slice(0, 64)
}

export function getUserAgent(req: Request): string | undefined {
  return req.headers.get('user-agent')?.slice(0, 500) ?? undefined
}
