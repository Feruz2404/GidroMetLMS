// Sample (mock) certificates shown to regular learners in the Certificates
// section alongside their real certificates. Purely client-side — no DB rows,
// no API calls — so they never affect the build or production data.
import type { Certificate } from '@/lib/api'

export const MOCK_CERT_ID_PREFIX = 'mock-cert-'

const MOCK_USER_ID = 'mock-user'

// verifyHash must be 40 hex chars to pass the verify view's format check.
const mockHash = (seed: string) => seed.padEnd(40, '0').slice(0, 40)

export const MOCK_CERTIFICATES: Certificate[] = [
  {
    id: `${MOCK_CERT_ID_PREFIX}1`,
    certNumber: 'GM-2025-0001',
    userId: MOCK_USER_ID,
    courseId: 'mock-course-1',
    score: 92,
    maxScore: 100,
    percentage: 92,
    issuedAt: '2025-03-14T09:00:00.000Z',
    validUntil: null,
    status: 'active',
    verifyHash: mockHash('a1b2c3d4e5f60718293a4b5c6d7e8f9001'),
    course: { id: 'mock-course-1', title: "Sinoptik meteorologiya asoslari" },
    template: {
      id: 'mock-template-1',
      titleText: 'SERTIFIKAT',
      primaryColor: '#0f766e',
      accentColor: '#ca8a04',
      signerName: 'A. Karimov',
      signerTitle: "O'quv markazi direktori",
    },
  },
  {
    id: `${MOCK_CERT_ID_PREFIX}2`,
    certNumber: 'GM-2025-0042',
    userId: MOCK_USER_ID,
    courseId: 'mock-course-2',
    score: 85,
    maxScore: 100,
    percentage: 85,
    issuedAt: '2025-05-22T09:00:00.000Z',
    validUntil: '2028-05-22T09:00:00.000Z',
    status: 'active',
    verifyHash: mockHash('b2c3d4e5f60718293a4b5c6d7e8f90a1b2'),
    course: { id: 'mock-course-2', title: 'Gidrologik kuzatuvlar va hisob-kitoblar' },
    template: {
      id: 'mock-template-2',
      titleText: 'SERTIFIKAT',
      primaryColor: '#1d4ed8',
      accentColor: '#f59e0b',
      signerName: 'A. Karimov',
      signerTitle: "O'quv markazi direktori",
    },
  },
  {
    id: `${MOCK_CERT_ID_PREFIX}3`,
    certNumber: 'GM-2025-0117',
    userId: MOCK_USER_ID,
    courseId: 'mock-course-3',
    score: 78,
    maxScore: 100,
    percentage: 78,
    issuedAt: '2025-08-05T09:00:00.000Z',
    validUntil: null,
    status: 'active',
    verifyHash: mockHash('c3d4e5f60718293a4b5c6d7e8f90a1b2c3'),
    course: { id: 'mock-course-3', title: "Iqlimshunoslik va iqlim o'zgarishi" },
    template: {
      id: 'mock-template-3',
      titleText: 'SERTIFIKAT',
      primaryColor: '#7c3aed',
      accentColor: '#facc15',
      signerName: 'A. Karimov',
      signerTitle: "O'quv markazi direktori",
    },
  },
  {
    id: `${MOCK_CERT_ID_PREFIX}4`,
    certNumber: 'GM-2026-0009',
    userId: MOCK_USER_ID,
    courseId: 'mock-course-4',
    score: 96,
    maxScore: 100,
    percentage: 96,
    issuedAt: '2026-01-19T09:00:00.000Z',
    validUntil: null,
    status: 'active',
    verifyHash: mockHash('d4e5f60718293a4b5c6d7e8f90a1b2c3d4'),
    course: { id: 'mock-course-4', title: 'Agrometeorologiya asoslari' },
    template: {
      id: 'mock-template-4',
      titleText: 'SERTIFIKAT',
      primaryColor: '#b45309',
      accentColor: '#0f766e',
      signerName: 'A. Karimov',
      signerTitle: "O'quv markazi direktori",
    },
  },
]

export function isMockCertificate(cert: Pick<Certificate, 'id'>): boolean {
  return cert.id.startsWith(MOCK_CERT_ID_PREFIX)
}

export function getMockCertificateByHash(hash: string | undefined | null): Certificate | null {
  if (!hash) return null
  const needle = hash.toLowerCase()
  return MOCK_CERTIFICATES.find((c) => c.verifyHash === needle) ?? null
}

// Shape consumed by the certificate verify view for an active certificate.
export function buildMockVerifyData(
  cert: Certificate,
  user: { firstName: string; lastName: string; middleName?: string | null } | null
) {
  return {
    found: true as const,
    status: 'active' as const,
    certNumber: cert.certNumber,
    score: cert.score,
    maxScore: cert.maxScore,
    percentage: cert.percentage,
    issuedAt: cert.issuedAt,
    validUntil: cert.validUntil ?? null,
    user: {
      firstName: user?.firstName ?? 'Talaba',
      lastName: user?.lastName ?? 'Namuna',
      middleName: user?.middleName ?? null,
    },
    course: cert.course ? { title: cert.course.title } : null,
    template: cert.template
      ? {
          titleText: cert.template.titleText,
          bodyText: null,
          primaryColor: cert.template.primaryColor,
          accentColor: cert.template.accentColor,
          signerName: cert.template.signerName ?? null,
          signerTitle: cert.template.signerTitle ?? null,
        }
      : null,
  }
}
