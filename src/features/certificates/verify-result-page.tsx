'use client'

import Link from 'next/link'
import { Copy, Printer, ScanSearch, SearchX, ShieldAlert, ShieldCheck, ShieldX, type LucideIcon } from 'lucide-react'
import { ErrorState } from '@/components/shared/error-state'
import { SectionCard } from '@/components/shared/section-card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useI18n } from '@/i18n/provider'
import { ApiError } from '@/lib/api-client'
import { routes } from '@/lib/routes'
import { cn } from '@/lib/utils'
import type { CertificateStatus, PublicCertificateDto } from '@/shared/dto'
import { useCertificateVerification } from './api'
import { CertificateSheet, sheetFromPublic } from './components/certificate-sheet'
import { useVerificationLink } from './components/use-verification-link'

type Outcome = CertificateStatus | 'not_found'

const OUTCOMES: Record<Outcome, { icon: LucideIcon; panel: string; badge: string }> = {
  active: { icon: ShieldCheck, panel: 'border-success/30 bg-success/[0.07]', badge: 'bg-success text-success-foreground' },
  revoked: { icon: ShieldX, panel: 'border-destructive/30 bg-destructive/[0.06]', badge: 'bg-destructive text-destructive-foreground' },
  expired: { icon: ShieldAlert, panel: 'border-warning/40 bg-warning/10', badge: 'bg-warning text-warning-foreground' },
  not_found: { icon: SearchX, panel: 'border-border bg-muted/50', badge: 'bg-muted-foreground/80 text-background' },
}

export function VerifyResultPage({ hash }: { hash: string }) {
  const { t } = useI18n()
  const verification = useCertificateVerification(hash)

  if (verification.isPending) return <ResultSkeleton />
  if (verification.isError) {
    if (verification.error instanceof ApiError && verification.error.status === 404) {
      return (
        <div className="mx-auto max-w-2xl space-y-6">
          <OutcomePanel outcome="not_found" title={t('certificates.verify.notFound.title')} description={t('certificates.verify.notFound.description')} />
          <p className="break-all text-center font-mono text-xs text-muted-foreground">{hash}</p>
          <div className="flex justify-center">
            <AnotherButton />
          </div>
        </div>
      )
    }
    return <ErrorState error={verification.error} onRetry={() => verification.refetch()} />
  }
  return <VerifiedCertificate certificate={verification.data} hash={hash} />
}

function VerifiedCertificate({ certificate, hash }: { certificate: PublicCertificateDto; hash: string }) {
  const { t, formatDate } = useI18n()
  const { copy } = useVerificationLink(hash)
  const validUntil = certificate.validUntil ? formatDate(certificate.validUntil, 'short') : t('certificates.sheet.indefinite')
  const copyByStatus = {
    active: { title: t('certificates.verify.valid.title'), description: t('certificates.verify.valid.description') },
    revoked: { title: t('certificates.verify.revoked.title'), description: t('certificates.verify.revoked.description') },
    expired: { title: t('certificates.verify.expired.title'), description: t('certificates.verify.expired.description', { date: validUntil }) },
  }[certificate.status]

  return (
    <div className="space-y-6">
      <div className="print:hidden">
        <OutcomePanel outcome={certificate.status} title={copyByStatus.title} description={copyByStatus.description} />
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <SectionCard title={t('certificates.verify.details')} className="print:hidden">
          <dl className="divide-y">
            <Row label={t('certificates.field.recipient')} value={certificate.recipientName} strong />
            <Row label={t('certificates.field.course')} value={certificate.courseTitle} />
            <Row label={t('certificates.field.hours')} value={t('common.hours', { count: certificate.courseHours })} />
            <Row label={t('certificates.field.score')} value={`${Math.round(certificate.percentage)}%`} />
            <Row label={t('certificates.field.issued')} value={formatDate(certificate.issuedAt, 'short')} />
            <Row label={t('certificates.field.validUntil')} value={validUntil} />
            <Row label={t('certificates.field.number')} value={<span className="font-mono">{certificate.certNumber}</span>} />
            <Row label={t('certificates.verify.issuer')} value={t('app.institution')} />
          </dl>
        </SectionCard>

        <section aria-labelledby="preview-heading" className="space-y-3">
          <h2 id="preview-heading" className="text-sm font-semibold text-muted-foreground print:hidden">
            {t('certificates.verify.preview')}
          </h2>
          <CertificateSheet data={sheetFromPublic(certificate, hash)} />
        </section>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:justify-center print:hidden">
        <AnotherButton />
        <Button variant="outline" onClick={copy}>
          <Copy aria-hidden="true" />
          {t('certificates.detail.copyLink')}
        </Button>
        <Button variant="outline" onClick={() => window.print()}>
          <Printer aria-hidden="true" />
          {t('certificates.detail.print')}
        </Button>
      </div>
    </div>
  )
}

function OutcomePanel({ outcome, title, description }: { outcome: Outcome; title: string; description: string }) {
  const { t, formatDate } = useI18n()
  const style = OUTCOMES[outcome]
  const Icon = style.icon
  return (
    <section role="status" className={cn('flex flex-col items-center gap-4 rounded-2xl border px-6 py-7 text-center sm:flex-row sm:text-left', style.panel)}>
      <span className={cn('flex size-14 shrink-0 items-center justify-center rounded-full shadow-sm', style.badge)}>
        <Icon className="size-7" aria-hidden="true" />
      </span>
      <div className="min-w-0 space-y-1">
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
        <p className="text-xs text-muted-foreground">{t('certificates.verify.checkedAt', { date: formatDate(new Date(), 'datetime') })}</p>
      </div>
    </section>
  )
}

function Row({ label, value, strong }: { label: string; value: React.ReactNode; strong?: boolean }) {
  return (
    <div className="grid gap-1 py-3 first:pt-0 last:pb-0 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-4">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className={cn('text-sm font-medium', strong && 'text-base font-semibold')}>{value}</dd>
    </div>
  )
}

function AnotherButton() {
  const { t } = useI18n()
  return (
    <Button asChild variant="outline">
      <Link href={routes.verify()}>
        <ScanSearch aria-hidden="true" />
        {t('certificates.verify.another')}
      </Link>
    </Button>
  )
}

function ResultSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true">
      <Skeleton className="h-32 rounded-2xl" />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <Skeleton className="h-96 rounded-xl" />
        <Skeleton className="aspect-[297/210] rounded-lg" />
      </div>
    </div>
  )
}
