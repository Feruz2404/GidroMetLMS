import test from 'node:test'
import assert from 'node:assert/strict'
import { api } from '../src/lib/api'

const storage = new Map<string, string>()

Object.defineProperty(globalThis, 'window', {
  value: globalThis,
  configurable: true,
})

Object.defineProperty(globalThis, 'localStorage', {
  value: {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, value),
    removeItem: (key: string) => storage.delete(key),
  },
  configurable: true,
})

test('attaches bearer auth to /auth/me requests', async () => {
  storage.set('gidroedu_token', 'abc123')

  let captured: { url?: string; headers?: Record<string, string> } | undefined
  globalThis.fetch = (async (input, init) => {
    captured = {
      url: typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url,
      headers: Object.fromEntries(new Headers(init?.headers).entries()),
    }
    return new Response(JSON.stringify({ status: 'success', data: { ok: true } }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }) as typeof fetch

  await api.get('/auth/me')

  assert.equal(captured?.url, '/api/auth/me')
  assert.equal(captured?.headers?.authorization, 'Bearer abc123')
})

test('does not attach bearer auth to public login requests', async () => {
  storage.delete('gidroedu_token')

  let captured: { headers?: Record<string, string> } | undefined
  globalThis.fetch = (async (_input, init) => {
    captured = {
      headers: Object.fromEntries(new Headers(init?.headers).entries()),
    }
    return new Response(JSON.stringify({ status: 'success', data: { ok: true } }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }) as typeof fetch

  await api.post('/auth', { email: 'a@b.com', password: 'secret' })

  assert.equal(captured?.headers?.Authorization, undefined)
})
