'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AlertTriangle, Ban, Copy, ExternalLink, FileX, Printer, Share2, ShieldX } from 'lucide-react'
import { EmptyState } from '@/components/shared/empty-state'
import { ErrorState } from '@/components/shared/error-state'
import { PageHeader } from '@/components/shared/page-header'
import { SectionCard } from '@/components/shared/section-card'
import { StatusBadge } from '@/components/shared/status-badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useSession } from '@/features/auth/session'
import { useI18n } from '@/i18n/provider'
import { ApiError } from '@/lib/api-client'
import { routes } from '@/lib/routes'
import type { CertificateDto } from '@/shared/dto'
import { PERMISSIONS } from '@/shared/roles'
import { useCertificate } from './api'
import { CertificateSheet, sheetFromCertificate } from './components/certificate-sheet'
import { RevokeDialog } from './components/revoke-dialog'
import { useVerificationLink } from './components/use-verification-link'

export function CertificatePage({ id }: { id: string }) {
  const { t } = useI18n()
  const certificate = useCertificate(id)

  if (certificate.isPending) return <CertificateSkeleton />
  if (certificate.isError) {
    if (certificate.error instanceof ApiError && certificate.error.status === 404) {
      return (
        <EmptyState
          icon={FileX}
          title={t('certificates.detail.notFound')}
          description={t('certificates.detail.notFoundHint')}
          action={
            <Button asChild variant="outline">
              <Link href={routes.certificates}>{t('certificates.detail.back')}</Link>
            </Button>
          }
        />
      )
    }
    return <ErrorState error={certificate.error} onRetry={() => certificate.refetch()} />
  }
  return <CertificateView certificate={certificate.data} />
}

function CertificateView({ certificate }: { certificate: CertificateDto }) {
  const { t, formatDate } = useI18n()
  const session = useSession()
  const { copy, share } = useVerificationLink(certificate.verifyHash)
  const [revokeOpen, setRevokeOpen] = useState(false)
  const canRevoke = session.can(PERMISSIONS.CERTIFICATES_MANAGE) && certificate.status !== 'revoked'

  return (
    <div className="space-y-6">
      <PageHeader
        className="print:hidden"
        back={{ href: routes.certificates, label: t('certificates.detail.back') }}
        eyebrow={certificate.certNumber}
        title={certificate.course.title}
        description={certificate.recipient.fullName}
        actions={
          <>
            <Button onClick={() => window.print()}>
              <Printer aria-hidden="true" />
              {t('certificates.detail.print')}
            </Button>
            <Button variant="outline" onClick={copy}>
              <Copy aria-hidden="true" />
              {t('certificates.detail.copyLink')}
            </Button>
            <Button variant="outline" size="icon" onClick={() => share(certificate.course.title)} aria-label={t('action.share')} title={t('action.share')}>
              <Share2 aria-hidden="true" />
            </Button>
            {canRevoke && (
              <Button variant="outline" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => setRevokeOpen(true)}>
                <Ban aria-hidden="true" />
                {t('certificates.revoke.action')}
              </Button>
            )}
          </>
        }
      />

      {certificate.status === 'revoked' && (
        <Alert variant="destructive" className="border-destructive/30 bg-destructive/5 print:hidden">
          <ShieldX aria-hidden="true" />
          <AlertTitle>{t('certificates.detail.revokedTitle')}</AlertTitle>
          <AlertDescription>{t('certificates.detail.revokedBanner')}</AlertDescription>
        </Alert>
      )}
      {certificate.status === 'expired' && (
        <Alert className="border-warning/40 bg-warning/10 print:hidden">
          <AlertTriangle aria-hidden="true" className="text-warning-foreground dark:text-warning" />
          <AlertTitle>{t('certificates.detail.expiredTitle')}</AlertTitle>
          <AlertDescription>{t('certificates.detail.expiredBanner', { date: formatDate(certificate.validUntil, 'short') })}</AlertDescription>
        </Alert>
      )}

      <div className="mx-auto max-w-5xl">
        <CertificateSheet data={sheetFromCertificate(certificate)} />
      </div>

      <div className="grid gap-5 md:grid-cols-3 print:hidden">
        <SectionCard title={t('certificates.detail.recipient')}>
          <dl className="space-y-3">
            <Fact label={t('certificates.field.recipient')} value={certificate.recipient.fullName} />
            <Fact label={t('common.position')} value={certificate.recipient.position} />
            <Fact label={t('common.department')} value={certificate.recipient.department} />
          </dl>
        </SectionCard>
        <SectionCard title={t('certificates.detail.validity')} action={<StatusBadge status={certificate.status} />}>
          <dl className="space-y-3">
            <Fact label={t('certificates.field.issued')} value={formatDate(certificate.issuedAt, 'short')} />
            <Fact
              label={t('certificates.field.validUntil')}
              value={certificate.validUntil ? formatDate(certificate.validUntil, 'short') : t('certificates.sheet.indefinite')}
            />
            <Fact label={t('certificates.field.score')} value={`${Math.round(certificate.percentage)}% · ${certificate.score}/${certificate.maxScore}`} />
          </dl>
        </SectionCard>
        <SectionCard title={t('certificates.detail.verification')} description={t('certificates.detail.verificationHint')}>
          <dl className="space-y-3">
            <Fact label={t('certificates.detail.code')} value={<span className="break-all font-mono text-xs">{certificate.verifyHash}</span>} />
          </dl>
          <Button asChild variant="soft" className="mt-4 w-full">
            <a href={routes.verify(certificate.verifyHash)} target="_blank" rel="noopener noreferrer">
              <ExternalLink aria-hidden="true" />
              {t('certificates.detail.openVerification')}
            </a>
          </Button>
        </SectionCard>
      </div>

      {canRevoke && <RevokeDialog certificate={certificate} open={revokeOpen} onOpenChange={setRevokeOpen} />}
    </div>
  )
}

function Fact({ label, value }: { label: string; value: React.ReactNode }) {
  const { t } = useI18n()
  return (
    <div className="space-y-0.5">
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium">{value || t('common.none')}</dd>
    </div>
  )
}

function CertificateSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true">
      <div className="space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-56" />
      </div>
      <Skeleton className="mx-auto aspect-[297/210] w-full max-w-5xl rounded-lg" />
    </div>
  )
}
