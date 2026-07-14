import test from 'node:test'
import assert from 'node:assert/strict'
import { getDatabaseConfigStatus, isDatabaseUrlConfigured, isSupportedDatabaseUrl } from '../src/lib/db'

test('treats SQLite file URLs as unsupported', () => {
  assert.equal(isDatabaseUrlConfigured('file:../db/custom.db'), false)
})

test('accepts postgres connection strings as production-ready', () => {
  assert.equal(isDatabaseUrlConfigured('postgresql://user:pass@host:5432/appdb'), true)
})

test('rejects sqlite because every runtime uses the authoritative PostgreSQL schema', () => {
  assert.equal(isSupportedDatabaseUrl('file:../db/custom.db'), false)
  assert.equal(isDatabaseUrlConfigured('file:../db/custom.db'), false)
})

test('reports production database readiness without exposing values', () => {
  const status = getDatabaseConfigStatus({
    NODE_ENV: 'production',
    DATABASE_URL: 'file:../db/custom.db',
  } as NodeJS.ProcessEnv)

  assert.equal(status.databaseUrlConfigured, true)
  assert.equal(status.databaseUrlSource, 'DATABASE_URL')
  assert.equal(status.databaseUrlSupported, false)
  assert.equal(status.databaseUrlProductionReady, false)
  assert.equal(status.productionRequiresPostgres, true)
})
