import assert from 'node:assert/strict'
import test from 'node:test'
import { api, ApiError, buildQuery, exportUrl, onUnauthorized } from '../src/lib/api-client'

function respondWith(status: number, body: unknown) {
  const calls: Array<{ url: string; init?: RequestInit }> = []
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    calls.push({ url: String(input), init })
    return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })
  }) as typeof fetch
  return calls
}

test('query strings skip empty values', () => {
  assert.equal(buildQuery({ a: 1, b: '', c: undefined, d: null, e: 'x y' }), '?a=1&e=x+y')
  assert.equal(buildQuery({}), '')
  assert.equal(exportUrl('/reports', { type: 'learners' }), '/api/reports?type=learners&format=csv')
})

test('successful responses unwrap data and pagination meta', async () => {
  const calls = respondWith(200, { status: 'success', data: [{ id: 1 }], meta: { total: 1, page: 1, pages: 1, limit: 12 } })
  const page = await api.page<{ id: number }>('/courses', { search: 'radar' })
  assert.equal(calls[0].url, '/api/courses?search=radar')
  assert.equal(calls[0].init?.credentials, 'same-origin')
  assert.equal(page.items[0].id, 1)
  assert.equal(page.meta.total, 1)
})

test('JSON bodies are sent only for mutations', async () => {
  const calls = respondWith(200, { status: 'success', data: { ok: true } })
  await api.post('/courses/1/enroll')
  assert.equal(calls[0].init?.method, 'POST')
  assert.equal(calls[0].init?.body, '{}')
  await api.get('/courses')
  assert.equal(calls[1].init?.body, undefined)
})

test('error envelopes become ApiError with the server code and field issues', async () => {
  respondWith(400, { status: 'error', code: 'VALIDATION_FAILED', message: 'Invalid request', details: [{ path: 'email', message: 'bad' }] })
  await assert.rejects(api.post('/users', {}), (error: unknown) => {
    assert.ok(error instanceof ApiError)
    assert.equal(error.status, 400)
    assert.equal(error.code, 'VALIDATION_FAILED')
    assert.deepEqual(error.issues, [{ path: 'email', message: 'bad' }])
    return true
  })
})

test('401 responses trigger the unauthorized handler', async () => {
  let called = 0
  onUnauthorized(() => {
    called += 1
  })
  respondWith(401, { status: 'error', code: 'UNAUTHORIZED', message: 'Authentication required' })
  await assert.rejects(api.get('/auth/me'))
  assert.equal(called, 1)
})

test('network failures surface as NETWORK errors', async () => {
  globalThis.fetch = (async () => {
    throw new TypeError('failed to fetch')
  }) as typeof fetch
  await assert.rejects(api.get('/courses'), (error: unknown) => error instanceof ApiError && error.code === 'NETWORK')
})
