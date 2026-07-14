import { existsSync, readFileSync } from 'node:fs'

const schemaPath = 'prisma/schema.prisma'
const legacySchemaPath = 'prisma/schema.postgresql.prisma'
const schema = readFileSync(schemaPath, 'utf8')

const failures = []
if (!/provider\s*=\s*"postgresql"/.test(schema)) failures.push('the authoritative provider must be PostgreSQL')
if (!/url\s*=\s*env\("DATABASE_URL"\)/.test(schema)) failures.push('DATABASE_URL must be the runtime datasource')
if (!/directUrl\s*=\s*env\("DIRECT_URL"\)/.test(schema)) failures.push('DIRECT_URL must be the migration datasource')
if (existsSync(legacySchemaPath)) failures.push('the redundant PostgreSQL schema must not exist')

if (failures.length > 0) {
  console.error(`Invalid Prisma configuration: ${failures.join('; ')}.`)
  process.exit(1)
}

console.info('Prisma uses one authoritative PostgreSQL schema with pooled and direct URLs.')
