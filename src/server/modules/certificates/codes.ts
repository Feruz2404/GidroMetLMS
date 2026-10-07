import crypto from 'node:crypto'

/** Human-readable certificate number: SRT-YYYYMM-XXXXXXXX. */
export function generateCertNumber(now = new Date()): string {
  const period = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`
  return `SRT-${period}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`
}

/** Unguessable public verification code (40 hex characters). */
export function generateVerifyHash(): string {
  return crypto.randomBytes(20).toString('hex')
}
