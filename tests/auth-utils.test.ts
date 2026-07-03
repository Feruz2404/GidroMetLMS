import test from 'node:test'
import assert from 'node:assert/strict'
import { hashPassword, isSessionSecretConfigured, verifyPassword } from '../src/lib/auth'

test('password hashing and verification are consistent', () => {
  const stored = hashPassword('Admin@2026')

  assert.equal(verifyPassword('Admin@2026', stored), true)
  assert.equal(verifyPassword('wrong-password', stored), false)
})

test('malformed password hashes fail closed', () => {
  assert.equal(verifyPassword('Admin@2026', 'not-a-valid-hash'), false)
  assert.equal(verifyPassword('Admin@2026', 'salt:abc'), false)
})

test('session secret must be configured with enough entropy', () => {
  assert.equal(isSessionSecretConfigured({ SESSION_SECRET: 'short' } as unknown as NodeJS.ProcessEnv), false)
  assert.equal(isSessionSecretConfigured({ SESSION_SECRET: 'a'.repeat(32) } as unknown as NodeJS.ProcessEnv), true)
  assert.equal(isSessionSecretConfigured({ AUTH_SECRET: 'b'.repeat(32) } as unknown as NodeJS.ProcessEnv), true)
})
