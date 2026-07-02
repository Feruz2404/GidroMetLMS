import test from 'node:test'
import assert from 'node:assert/strict'
import { isDatabaseUrlConfigured } from '../src/lib/db'

test('treats local sqlite file URLs as not production-ready', () => {
  assert.equal(isDatabaseUrlConfigured('file:../db/custom.db'), false)
})

test('accepts postgres connection strings as production-ready', () => {
  assert.equal(isDatabaseUrlConfigured('postgresql://user:pass@host:5432/appdb'), true)
})
