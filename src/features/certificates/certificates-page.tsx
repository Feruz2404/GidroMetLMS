'use client'

import { useSession } from '@/features/auth/session'
import { CertificateRegistry } from './components/certificate-registry'
import { MyCertificates } from './components/my-certificates'

/** Learners see their own gallery; staff see the (scoped) registry. */
export function CertificatesPage() {
  const { isAdmin, isInstructor, isManager } = useSession()
  return isAdmin || isInstructor || isManager ? <CertificateRegistry /> : <MyCertificates />
}
