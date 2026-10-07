import type { CertificateStatus } from '@/shared/dto'

/** Revocation wins; otherwise a past validity date means the certificate expired. */
export function certificateStatus(certificate: { status: string; validUntil: Date | null }, now = new Date()): CertificateStatus {
  if (certificate.status === 'revoked') return 'revoked'
  if (certificate.validUntil && certificate.validUntil < now) return 'expired'
  return 'active'
}
