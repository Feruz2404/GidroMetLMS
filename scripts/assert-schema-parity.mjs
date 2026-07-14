import { readFileSync } from 'node:fs'

const sqlite = readFileSync('prisma/schema.prisma', 'utf8')
const postgres = readFileSync('prisma/schema.postgresql.prisma', 'utf8')

function normalize(source) {
  return source
    .replace(/provider\s*=\s*"(?:sqlite|postgresql)"/, 'provider = "DATABASE_PROVIDER"')
    .replace(/\r\n/g, '\n')
    .trim()
}

if (normalize(sqlite) !== normalize(postgres)) {
  console.error('Prisma schema drift detected. Model definitions must remain identical across local and production schemas.')
  process.exit(1)
}

console.info('Prisma schemas are structurally aligned.')
