import test from 'node:test'
import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import {
  extractSessionCookie,
  extractToken,
  hashPassword,
  needsPasswordRehash,
  serializeExpiredSessionCookie,
  serializeSessionCookie,
  verifyPassword,
} from '../src/lib/auth'
import { hasPermission, PERMISSIONS } from '../src/server/auth/permissions'
import { consumeRateLimit, resetRateLimit } from '../src/lib/rate-limit'
import { loginSchema, passwordSchema } from '../src/validators/auth'
import { safeResourceUrl } from '../src/lib/utils'

test('session cookies are HttpOnly, SameSite, and Secure in production mode', () => {
  const token = 'a'.repeat(96)
  const cookie = serializeSessionCookie(token, true)
  assert.match(cookie, /HttpOnly/)
  assert.match(cookie, /SameSite=Lax/)
  assert.match(cookie, /Secure/)
  assert.equal(extractSessionCookie({ headers: new Headers({ cookie }) }), token)
  assert.match(serializeExpiredSessionCookie(true), /Max-Age=0/)
})

test('bearer parsing fails closed for malformed authorization headers', () => {
  assert.equal(extractToken({ headers: new Headers({ authorization: 'abc' }) }), undefined)
  assert.equal(extractToken({ headers: new Headers({ authorization: `Bearer ${'b'.repeat(96)}` }) }), 'b'.repeat(96))
})

test('modern passwords verify and legacy hashes are marked for rehash', () => {
  const modern = hashPassword('MeteoDemo!2026')
  assert.equal(verifyPassword('MeteoDemo!2026', modern), true)
  assert.equal(needsPasswordRehash(modern), false)

  const legacySalt = '0123456789abcdef0123456789abcdef'
  const legacyHash = crypto.pbkdf2Sync('MeteoDemo!2026', legacySalt, 100_000, 64, 'sha512').toString('hex')
  assert.equal(verifyPassword('MeteoDemo!2026', `${legacySalt}:${legacyHash}`), true)
  assert.equal(needsPasswordRehash(`${legacySalt}:${legacyHash}`), true)
})

test('role permission matrix separates organization and department reporting', () => {
  assert.equal(hasPermission('super_admin', PERMISSIONS.SYSTEM_MANAGE), true)
  assert.equal(hasPermission('administrator', PERMISSIONS.USERS_MANAGE), true)
  assert.equal(hasPermission('instructor', PERMISSIONS.COURSES_MANAGE_OWN), true)
  assert.equal(hasPermission('instructor', PERMISSIONS.COURSES_MANAGE_ALL), false)
  assert.equal(hasPermission('department_manager', PERMISSIONS.REPORTS_VIEW_DEPARTMENT), true)
  assert.equal(hasPermission('learner', PERMISSIONS.USERS_MANAGE), false)
})

test('auth validation normalizes email and enforces strong passwords', () => {
  assert.equal(loginSchema.parse({ email: ' USER@Example.COM ', password: 'x' }).email, 'user@example.com')
  assert.equal(passwordSchema.safeParse('short').success, false)
  assert.equal(passwordSchema.safeParse('MeteoDemo!2026').success, true)
})

test('login rate limiting rejects attempts beyond the configured limit', () => {
  const key = `test-${Date.now()}`
  resetRateLimit(key)
  for (let index = 0; index < 5; index += 1) assert.equal(consumeRateLimit(key, 5, 60_000).allowed, true)
  assert.equal(consumeRateLimit(key, 5, 60_000).allowed, false)
  resetRateLimit(key)
})

test('resource URLs reject executable and protocol-relative values', () => {
  assert.equal(safeResourceUrl('javascript:alert(1)'), null)
  assert.equal(safeResourceUrl('//evil.example/file.pdf'), null)
  assert.equal(safeResourceUrl('/uploads/file.pdf'), '/uploads/file.pdf')
  assert.equal(safeResourceUrl('https://example.com/file.pdf'), 'https://example.com/file.pdf')
})
