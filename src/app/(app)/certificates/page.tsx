import type { Metadata } from 'next'
import { CertificatesPage } from '@/features/certificates/certificates-page'

export const metadata: Metadata = { title: 'Sertifikatlar' }

export default function Page() {
  return <CertificatesPage />
}
