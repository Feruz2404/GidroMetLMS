import crypto from 'node:crypto'
import { promisify } from 'node:util'

const pbkdf2 = promisify(crypto.pbkdf2)

const ALGORITHM = 'pbkdf2-sha256'
const ITERATIONS = 600_000
const KEY_LENGTH = 64
const LEGACY_ITERATIONS = 100_000

interface ParsedHash {
  salt: string
  hash: string
  iterations: number
  digest: 'sha256' | 'sha512'
}

/** Supports the current `pbkdf2-sha256$iterations$salt$hash` format and the legacy `salt:hash` (sha512). */
function parseStoredHash(stored: string): ParsedHash | null {
  const modern = stored.split('$')
  if (modern.length === 4 && modern[0] === ALGORITHM) {
    return { iterations: Number(modern[1]), salt: modern[2], hash: modern[3], digest: 'sha256' }
  }
  const legacy = stored.split(':')
  if (legacy.length === 2) return { salt: legacy[0], hash: legacy[1], iterations: LEGACY_ITERATIONS, digest: 'sha512' }
  return null
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString('hex')
  const derived = await pbkdf2(password, salt, ITERATIONS, KEY_LENGTH, 'sha256')
  return `${ALGORITHM}$${ITERATIONS}$${salt}$${derived.toString('hex')}`
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parsed = parseStoredHash(stored)
  if (!parsed) return false
  const { salt, hash, iterations, digest } = parsed
  if (!salt || !hash || !Number.isSafeInteger(iterations) || iterations < LEGACY_ITERATIONS) return false
  if (!/^[a-f0-9]+$/i.test(hash)) return false

  const expected = Buffer.from(hash, 'hex')
  const actual = await pbkdf2(password, salt, iterations, KEY_LENGTH, digest)
  return expected.length === actual.length && crypto.timingSafeEqual(expected, actual)
}

export function needsPasswordRehash(stored: string): boolean {
  const [algorithm, iterations] = stored.split('$')
  return algorithm !== ALGORITHM || Number(iterations) < ITERATIONS
}
