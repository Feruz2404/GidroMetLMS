'use client'

import { useId } from 'react'
import { LogoMark } from '@/components/brand/logo'
import { useI18n } from '@/i18n/provider'
import { cn } from '@/lib/utils'
import type { CertificateDto, CertificateStatus, CertificateTemplateDto, ISODate, PublicCertificateDto } from '@/shared/dto'
import { CertificateQr } from './certificate-qr'

/** What the printable sheet needs; built from either the private or the public certificate DTO. */
export interface CertificateSheetData {
  status: CertificateStatus
  certNumber: string
  verifyHash: string
  recipientName: string
  courseTitle: string
  courseHours: number
  percentage: number
  issuedAt: ISODate
  validUntil: ISODate | null
  template: CertificateTemplateDto | null
}

export function sheetFromCertificate(certificate: CertificateDto): CertificateSheetData {
  return {
    status: certificate.status,
    certNumber: certificate.certNumber,
    verifyHash: certificate.verifyHash,
    recipientName: certificate.recipient.fullName,
    courseTitle: certificate.course.title,
    courseHours: certificate.course.durationHours,
    percentage: certificate.percentage,
    issuedAt: certificate.issuedAt,
    validUntil: certificate.validUntil,
    template: certificate.template,
  }
}

export function sheetFromPublic(certificate: PublicCertificateDto, verifyHash: string): CertificateSheetData {
  const { status, certNumber, recipientName, courseTitle, courseHours, percentage, issuedAt, validUntil, template } = certificate
  return { status, certNumber, verifyHash, recipientName, courseTitle, courseHours, percentage, issuedAt, validUntil, template }
}

const HEX_COLOR = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i
const DEFAULT_PRIMARY = '#0f3d6e'
const DEFAULT_ACCENT = '#0ea5e9'

/** Normalises to #rrggbb so an alpha suffix can be appended; anything else falls back. */
function safeColor(value: string | undefined, fallback: string): string {
  if (!value || !HEX_COLOR.test(value)) return fallback
  return value.length === 4 ? `#${[...value.slice(1)].map((digit) => digit + digit).join('')}` : value
}

/** Template colours come from the database; only plain hex values reach inline styles. */
export function certificateColors(template: CertificateTemplateDto | null) {
  return { primary: safeColor(template?.primaryColor, DEFAULT_PRIMARY), accent: safeColor(template?.accentColor, DEFAULT_ACCENT) }
}

/**
 * Landscape A4 certificate. Every size is in container-width units (cqw), so the
 * same sheet scales from a small preview to a full printed page. It is paper:
 * it keeps its own light palette in dark mode and prints with exact colours.
 */
export function CertificateSheet({ data, className }: { data: CertificateSheetData; className?: string }) {
  const { t, locale, formatDate } = useI18n()
  const { primary, accent } = certificateColors(data.template)
  // Template wording is authored in Uzbek; other locales use the catalogue so the sheet reads in one language.
  const fromTemplate = locale === 'uz' && data.template
  const title = (fromTemplate && data.template?.titleText) || t('certificates.sheet.title')
  const body = (fromTemplate && data.template?.bodyText) || t('certificates.sheet.body')
  const signerTitle = (fromTemplate && data.template?.signerTitle) || t('certificates.sheet.signerTitle')
  const stamp = data.status === 'revoked' ? t('certificates.sheet.stampRevoked') : data.status === 'expired' ? t('certificates.sheet.stampExpired') : null

  return (
    <article
      aria-label={t('certificates.sheet.label', { name: data.recipientName })}
      className={cn('print-area @container relative aspect-[297/210] w-full overflow-hidden rounded-lg bg-white text-slate-700 shadow-[var(--shadow-elevated)] ring-1 ring-black/5', className)}
      style={{ printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact', backgroundImage: `radial-gradient(ellipse at 12% 8%, ${accent}14, transparent 45%), radial-gradient(ellipse at 90% 95%, ${primary}12, transparent 50%)` }}
    >
      <WaveBackdrop primary={primary} accent={accent} />
      <div className="pointer-events-none absolute inset-[2.2cqw] rounded-[0.6cqw] border-[0.45cqw]" style={{ borderColor: primary }} aria-hidden="true" />
      <div className="pointer-events-none absolute inset-[3.1cqw] rounded-[0.3cqw] border-[0.12cqw]" style={{ borderColor: accent }} aria-hidden="true" />
      <CornerOrnaments color={accent} />

      <div className="relative flex h-full flex-col px-[6.5cqw] pb-[5.4cqw] pt-[5.2cqw]">
        <header className="flex items-start justify-between gap-[2cqw]">
          <div className="flex items-center gap-[1.2cqw]">
            <LogoMark className="size-[5cqw]" />
            <div className="leading-tight">
              <p className="text-[1.9cqw] font-semibold tracking-tight text-slate-900">
                Gidro<span style={{ color: accent }}>Edu</span>
              </p>
              <p className="text-[1.05cqw] text-slate-500">{t('app.institution')}</p>
            </div>
          </div>
          <div className="text-right leading-tight">
            <p className="text-[0.95cqw] font-medium uppercase tracking-[0.18em] text-slate-500">{t('certificates.sheet.number')}</p>
            <p className="font-mono text-[1.45cqw] font-semibold text-slate-900">{data.certNumber}</p>
          </div>
        </header>

        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <h2 className="font-serif text-[5.4cqw] font-semibold uppercase leading-none tracking-[0.32em]" style={{ color: primary }}>
            {title}
          </h2>
          <Divider color={accent} />
          <p className="text-[1.25cqw] font-medium uppercase tracking-[0.22em] text-slate-500">{t('certificates.sheet.certifies')}</p>
          <p className="mt-[1.4cqw] max-w-[78cqw] font-serif text-[3.7cqw] font-semibold italic leading-tight text-slate-900">{data.recipientName}</p>
          <span className="mt-[1cqw] h-[0.12cqw] w-[42cqw]" style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} aria-hidden="true" />
          <p className="mt-[1.6cqw] max-w-[74cqw] text-[2cqw] font-semibold leading-snug" style={{ color: primary }}>
            «{data.courseTitle}»
          </p>
          <p className="mt-[0.9cqw] max-w-[64cqw] text-[1.35cqw] leading-relaxed text-slate-600">{body}</p>

          <dl className="mt-[2.2cqw] flex items-stretch divide-x divide-slate-200 rounded-[0.6cqw] border border-slate-200 bg-white/70">
            <SheetFact label={t('certificates.sheet.hours')} value={t('certificates.sheet.hoursValue', { count: data.courseHours })} />
            <SheetFact label={t('certificates.sheet.score')} value={`${Math.round(data.percentage)}%`} />
            <SheetFact label={t('certificates.sheet.issued')} value={formatDate(data.issuedAt, 'short')} />
            <SheetFact label={t('certificates.sheet.validUntil')} value={data.validUntil ? formatDate(data.validUntil, 'short') : t('certificates.sheet.indefinite')} />
          </dl>
        </div>

        <footer className="grid grid-cols-[1fr_auto_1fr] items-end gap-[2cqw]">
          <Seal primary={primary} accent={accent} />
          <div className="flex flex-col items-center text-center">
            {data.template?.signerName && <p className="mb-[0.4cqw] font-serif text-[1.5cqw] italic text-slate-800">{data.template.signerName}</p>}
            <span className="h-[0.1cqw] w-[24cqw] bg-slate-400" aria-hidden="true" />
            <p className="mt-[0.6cqw] text-[1.1cqw] font-medium text-slate-600">{signerTitle}</p>
          </div>
          <div className="flex items-end justify-end gap-[1.2cqw]">
            <div className="text-right leading-tight">
              <p className="text-[0.95cqw] font-semibold uppercase tracking-[0.14em] text-slate-500">{t('certificates.sheet.verify')}</p>
              <p className="mt-[0.4cqw] break-all font-mono text-[0.8cqw] text-slate-500">{data.verifyHash}</p>
            </div>
            <CertificateQr hash={data.verifyHash} color={primary} alt={t('certificates.sheet.qrAlt')} className="size-[9cqw] shrink-0 rounded-[0.3cqw] p-[0.4cqw] ring-1 ring-slate-200" />
          </div>
        </footer>
      </div>

      {stamp && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
          <span
            className={cn(
              '-rotate-[14deg] rounded-[1cqw] border-[0.5cqw] bg-white/70 px-[3cqw] py-[1cqw] text-[5cqw] font-bold uppercase tracking-[0.12em]',
              data.status === 'revoked' ? 'border-red-600/80 text-red-600/85' : 'border-amber-500/80 text-amber-600/90'
            )}
          >
            {stamp}
          </span>
        </div>
      )}
    </article>
  )
}

function SheetFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col-reverse px-[2.2cqw] py-[0.9cqw]">
      <dt className="text-[0.85cqw] font-medium uppercase tracking-[0.14em] text-slate-500">{label}</dt>
      <dd className="text-[1.55cqw] font-semibold tabular-nums text-slate-900">{value}</dd>
    </div>
  )
}

function Divider({ color }: { color: string }) {
  return (
    <div className="my-[1.6cqw] flex items-center gap-[1cqw]" aria-hidden="true">
      <span className="h-[0.12cqw] w-[9cqw]" style={{ background: `linear-gradient(90deg, transparent, ${color})` }} />
      <span className="size-[0.9cqw] rotate-45" style={{ background: color }} />
      <span className="h-[0.12cqw] w-[9cqw]" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
    </div>
  )
}

function WaveBackdrop({ primary, accent }: { primary: string; accent: string }) {
  return (
    <svg className="pointer-events-none absolute inset-0 size-full" viewBox="0 0 297 210" preserveAspectRatio="none" aria-hidden="true">
      {Array.from({ length: 7 }, (_, index) => (
        <path
          key={index}
          d={`M0 ${168 + index * 5} C 50 ${156 + index * 5}, 100 ${182 + index * 5}, 150 ${168 + index * 5} S 250 ${154 + index * 5}, 297 ${166 + index * 5}`}
          fill="none"
          stroke={index % 2 ? accent : primary}
          strokeOpacity={0.07}
          strokeWidth={0.6}
        />
      ))}
      {Array.from({ length: 5 }, (_, index) => (
        <path
          key={`top-${index}`}
          d={`M0 ${18 + index * 4} C 70 ${8 + index * 4}, 140 ${30 + index * 4}, 210 ${16 + index * 4} S 280 ${10 + index * 4}, 297 ${14 + index * 4}`}
          fill="none"
          stroke={accent}
          strokeOpacity={0.06}
          strokeWidth={0.5}
        />
      ))}
    </svg>
  )
}

function CornerOrnaments({ color }: { color: string }) {
  const corners = ['left-[2.6cqw] top-[2.6cqw]', 'right-[2.6cqw] top-[2.6cqw]', 'bottom-[2.6cqw] left-[2.6cqw]', 'bottom-[2.6cqw] right-[2.6cqw]']
  return (
    <>
      {corners.map((position) => (
        <span key={position} className={cn('pointer-events-none absolute size-[1.1cqw] rotate-45 border-[0.12cqw] bg-white', position)} style={{ borderColor: color }} aria-hidden="true" />
      ))}
    </>
  )
}

/** Decorative round seal with the institution name on a ring. */
function Seal({ primary, accent }: { primary: string; accent: string }) {
  const { t } = useI18n()
  const ringId = `seal-${useId().replace(/[^\w-]/g, '')}`
  const text = `${t('app.name').toUpperCase()} • ${t('certificates.sheet.seal')} • `
  return (
    <svg viewBox="0 0 100 100" className="size-[10cqw] opacity-80" aria-hidden="true">
      <defs>
        <path id={ringId} d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
      </defs>
      <circle cx="50" cy="50" r="48" fill="none" stroke={primary} strokeWidth="2" />
      <circle cx="50" cy="50" r="44.5" fill="none" stroke={primary} strokeWidth="0.6" />
      <circle cx="50" cy="50" r="29" fill="none" stroke={accent} strokeWidth="0.8" />
      <text fill={primary} fontSize="7.2" fontWeight="600" fontFamily="ui-sans-serif, system-ui, sans-serif">
        <textPath href={`#${ringId}`} textLength="230" lengthAdjust="spacing">
          {text}
        </textPath>
      </text>
      <path d="M50 30c-5.6 6.7-9.8 12.2-9.8 17.3a9.8 9.8 0 0 0 19.6 0c0-5.1-4.2-10.6-9.8-17.3Z" fill={accent} fillOpacity="0.9" />
      <path d="M42.3 52c2.6 1.9 5.1 1.9 7.7 0s5.1-1.9 7.7 0" stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  )
}
