// Loads .env for operator scripts run with tsx (Next.js and the Prisma CLI do
// this themselves). Variables already set in the environment take precedence.
import { existsSync } from 'node:fs'

if (existsSync('.env')) process.loadEnvFile('.env')
