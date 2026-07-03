import test from 'node:test'
import assert from 'node:assert/strict'
import { getDatabaseConfigStatus, isDatabaseUrlConfigured, isSupportedDatabaseUrl } from '../src/lib/db'

test('treats local sqlite file URLs as not production-ready', () => {
  assert.equal(isDatabaseUrlConfigured('file:../db/custom.db'), false)
})

test('accepts postgres connection strings as production-ready', () => {
  assert.equal(isDatabaseUrlConfigured('postgresql://user:pass@host:5432/appdb'), true)
})

test('allows sqlite only as a supported local database URL', () => {
  assert.equal(isSupportedDatabaseUrl('file:../db/custom.db'), true)
  assert.equal(isDatabaseUrlConfigured('file:../db/custom.db'), false)
})

test('reports production database readiness without exposing values', () => {
  const status = getDatabaseConfigStatus({
    NODE_ENV: 'production',
    DATABASE_URL: 'file:../db/custom.db',
  } as NodeJS.ProcessEnv)

  assert.equal(status.databaseUrlConfigured, true)
  assert.equal(status.databaseUrlSource, 'DATABASE_URL')
  assert.equal(status.databaseUrlSupported, true)
  assert.equal(status.databaseUrlProductionReady, false)
  assert.equal(status.productionRequiresPostgres, true)
})
