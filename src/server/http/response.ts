import type { ApiErrorBody, ErrorCode, PageMeta } from '@/shared/error-codes'

const NO_STORE = { 'Cache-Control': 'no-store' }

export function ok<T>(data: T, meta?: PageMeta | Record<string, unknown>, init?: ResponseInit): Response {
  return Response.json(
    { status: 'success', data, ...(meta ? { meta } : {}) },
    { ...init, headers: { ...NO_STORE, ...init?.headers } }
  )
}

export function created<T>(data: T): Response {
  return ok(data, undefined, { status: 201 })
}

export function fail(status: number, code: ErrorCode, message: string, details?: unknown): Response {
  const body: ApiErrorBody = { status: 'error', code, message, ...(details === undefined ? {} : { details }) }
  return Response.json(body, { status, headers: NO_STORE })
}

export function csv(filename: string, rows: Array<Record<string, unknown>>): Response {
  const headers = rows.length ? Object.keys(rows[0]) : []
  const escape = (value: unknown) => {
    const text = value === null || value === undefined ? '' : value instanceof Date ? value.toISOString() : String(value)
    return /[",\n\r;]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
  }
  const body = [headers.join(','), ...rows.map((row) => headers.map((header) => escape(row[header])).join(','))].join('\r\n')
  // Excel opens UTF-8 CSV correctly only with a BOM.
  return new Response(`﻿${body}`, {
    headers: {
      ...NO_STORE,
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
