'use client'

import Link from 'next/link'
import { ArrowRight, CalendarCheck, CalendarClock } from 'lucide-react'
import { LogoMark } from '@/components/brand/logo'
import { StatusBadge } from '@/components/shared/status-badge'
import { useI18n } from '@/i18n/provider'
import { routes } from '@/lib/routes'
import { cn } from '@/lib/utils'
import type { CertificateDto } from '@/shared/dto'
import { certificateColors } from './certificate-sheet'

/** Gallery card: a miniature of the paper certificate above its key facts. */
export function CertificateCard({ certificate }: { certificate: CertificateDto }) {
  const { t, formatDate } = useI18n()
  const { primary, accent } = certificateColors(certificate.template)
  const inactive = certificate.status !== 'active'

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border bg-card shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-elevated)]">
      <div className="bg-muted/50 p-4">
        {/* Paper miniature keeps light colours in both themes, like the printed sheet. */}
        <div
          className={cn('relative overflow-hidden rounded-md bg-white px-5 pb-4 pt-3.5 text-slate-700 shadow-sm ring-1 ring-black/5', inactive && 'opacity-75 grayscale-[0.4]')}
          style={{ backgroundImage: `radial-gradient(ellipse at 10% 0%, ${accent}1f, transparent 55%)` }}
        >
          <span className="pointer-events-none absolute inset-1.5 rounded-[3px] border-2" style={{ borderColor: primary }} aria-hidden="true" />
          <span className="pointer-events-none absolute inset-[9px] rounded-[2px] border" style={{ borderColor: `${accent}99` }} aria-hidden="true" />
          <div className="relative flex items-center justify-between gap-2">
            <LogoMark className="size-6" />
            <span className="font-mono text-[0.65rem] font-semibold text-slate-500">{certificate.certNumber}</span>
          </div>
          <div className="relative mt-2 text-center">
            <p className="font-serif text-lg font-semibold uppercase tracking-[0.3em]" style={{ color: primary }}>
              {t('certificates.sheet.title')}
            </p>
            <div className="mx-auto my-1.5 flex items-center justify-center gap-1.5" aria-hidden="true">
              <span className="h-px w-10" style={{ background: `linear-gradient(90deg, transparent, ${accent})` }} />
              <span className="size-1.5 rotate-45" style={{ background: accent }} />
              <span className="h-px w-10" style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }} />
            </div>
            <p className="line-clamp-1 font-serif text-sm italic text-slate-800">{certificate.recipient.fullName}</p>
          </div>
          <div className="relative mt-3 flex items-center justify-center gap-2 text-[0.7rem] font-semibold">
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-600">{t('common.hours', { count: certificate.course.durationHours })}</span>
            <span className="rounded-full px-2 py-0.5 text-white" style={{ background: primary }}>
              {Math.round(certificate.percentage)}%
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <StatusBadge status={certificate.status} />
        <h3 className="line-clamp-2 text-[1.05rem] font-semibold leading-snug tracking-tight">
          <Link href={routes.certificate(certificate.id)} className="after:absolute after:inset-0 after:content-[''] focus-visible:underline group-hover:text-primary">
            {certificate.course.title}
          </Link>
        </h3>
        <dl className="mt-auto space-y-1.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <CalendarCheck className="size-3.5" aria-hidden="true" />
            <dt>{t('certificates.field.issued')}:</dt>
            <dd className="font-medium text-foreground">{formatDate(certificate.issuedAt, 'short')}</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <CalendarClock className="size-3.5" aria-hidden="true" />
            <dt>{t('certificates.field.validUntil')}:</dt>
            <dd className={cn('font-medium', certificate.status === 'expired' ? 'text-warning-foreground dark:text-warning' : 'text-foreground')}>
              {certificate.validUntil ? formatDate(certificate.validUntil, 'short') : t('certificates.sheet.indefinite')}
            </dd>
          </div>
        </dl>
        <div className="flex items-center justify-end border-t pt-4">
          <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
            {t('certificates.card.open')}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </span>
        </div>
      </div>
    </article>
  )
}
