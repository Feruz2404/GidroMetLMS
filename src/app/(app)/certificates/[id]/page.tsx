import type { Metadata } from 'next'
import { CertificatePage } from '@/features/certificates/certificate-page'

export const metadata: Metadata = { title: 'Sertifikat' }

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <CertificatePage id={id} />
}
