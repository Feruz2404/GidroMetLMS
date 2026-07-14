'use client'

import { FormEvent, useEffect, useState, useMemo } from 'react'
import { api, formatDate } from '@/lib/api'
import { useAuth, useNav } from '@/store/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'
import {
  ShieldAlert,
  Printer,
  ArrowLeft,
  QrCode,
  Hash,
  Calendar,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Droplets,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useTranslation } from '@/lib/i18n'
import { cn } from '@/lib/utils'

// Verify endpoint response shape (public)
type VerifyResponse =
  | {
      found: true
      status: 'active'
      certNumber: string
      score: number
      maxScore: number
      percentage: number
      issuedAt: string
      validUntil: string | null
      user: {
        firstName: string
        lastName: string
        middleName?: string | null
      }
      course: { title: string } | null
      template: {
        titleText: string
        bodyText?: string | null
        primaryColor: string
        accentColor: string
        signerName?: string | null
        signerTitle?: string | null
      } | null
    }
  | {
      found: true
      status: 'revoked' | 'expired'
      certNumber: string
      validUntil?: string | null
      message: string
    }

interface ApiEnvelope {
  status: string
  data: VerifyResponse
}

type CornerPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

export function CertificateVerifyView() {
  const params = useNav((s) => s.params)
  const navigate = useNav((s) => s.navigate)
  const user = useAuth((s) => s.user)
  const { toast } = useToast()
  const { t } = useTranslation()
  const hash = params.hash
  const shouldPrint = params.print === '1'

  const [data, setData] = useState<VerifyResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [verificationInput, setVerificationInput] = useState('')
  const [inputError, setInputError] = useState('')

  useEffect(() => {
    if (!hash) {
      Promise.resolve().then(() => {
        setNotFound(false)
        setData(null)
        setLoading(false)
      })
      return
    }
    let cancelled = false
    Promise.resolve().then(() => {
      if (!cancelled) setLoading(true)
    })
    api
      .get<ApiEnvelope>(`/certificates/verify?hash=${encodeURIComponent(hash)}`)
      .then((r) => {
        if (cancelled) return
        setData(r.data)
        setNotFound(false)
      })
      .catch(() => {
        if (cancelled) return
        setNotFound(true)
        setData(null)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [hash])

  // Trigger print if requested (after data loads)
  useEffect(() => {
    if (
      shouldPrint &&
      !loading &&
      data &&
      data.status === 'active' &&
      typeof window !== 'undefined'
    ) {
      const t = setTimeout(() => {
        window.print()
      }, 600)
      return () => clearTimeout(t)
    }
  }, [shouldPrint, loading, data])

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print()
    }
  }

  const handleVerify = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const value = verificationInput.trim()
    let verificationHash = /^[a-f0-9]{40}$/i.test(value) ? value : ''

    if (!verificationHash && typeof window !== 'undefined') {
      try {
        const url = new URL(value, window.location.origin)
        const candidate = url.searchParams.get('hash') ?? url.searchParams.get('cert') ?? ''
        if (/^[a-f0-9]{40}$/i.test(candidate)) verificationHash = candidate
      } catch {
        // The validation message below covers malformed links.
      }
    }

    if (!verificationHash) {
      setInputError(t('certificates.invalidCode'))
      return
    }

    setInputError('')
    navigate('certificate-verify', { hash: verificationHash.toLowerCase() })
  }

  const handleBack = () => {
    if (user) navigate('certificates')
    else navigate('certificate-verify')
  }

  const handleCopyLink = () => {
    if (typeof window === 'undefined' || !hash) return
    const url = `${window.location.origin}?view=verify&hash=${hash}`
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(url)
        .then(() => {
          toast({
            title: t('certificates.linkCopied'),
            description: t('certificates.linkCopiedDesc'),
          })
        })
        .catch(() => {
          toast({
            title: t('common.error'),
            description: t('certificates.linkCopyFailed'),
            variant: 'destructive',
          })
        })
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Button
          variant="ghost"
          onClick={() => navigate('certificates')}
          size="sm"
          className="print:hidden"
        >
          <ArrowLeft className="w-4 h-4" /> {t('certificates.backToCerts')}
        </Button>
        <div className="flex justify-center py-8">
          <Skeleton className="w-full max-w-4xl h-[600px] rounded-xl" />
        </div>
      </div>
    )
  }

  if (!hash) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-8">
        <Card className="w-full max-w-xl shadow-sm">
          <CardContent className="p-6 sm:p-8">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700">
              <QrCode className="h-7 w-7" aria-hidden="true" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-semibold tracking-tight">{t('certificates.verify')}</h1>
              <p className="mt-2 text-sm text-muted-foreground">{t('certificates.verifyEntryDesc')}</p>
            </div>

            <form onSubmit={handleVerify} className="mt-7 space-y-4" noValidate>
              <div className="space-y-2">
                <label htmlFor="certificate-code" className="text-sm font-medium">
                  {t('certificates.verificationCode')}
                </label>
                <Input
                  id="certificate-code"
                  value={verificationInput}
                  onChange={(event) => {
                    setVerificationInput(event.target.value)
                    if (inputError) setInputError('')
                  }}
                  placeholder={t('certificates.verificationCodePlaceholder')}
                  autoComplete="off"
                  spellCheck={false}
                  aria-invalid={Boolean(inputError)}
                  aria-describedby={inputError ? 'certificate-code-error' : undefined}
                  className="h-11 font-mono"
                />
                {inputError && (
                  <p id="certificate-code-error" role="alert" className="text-sm text-destructive">
                    {inputError}
                  </p>
                )}
              </div>
              <Button type="submit" className="h-11 w-full">
                <CheckCircle2 className="h-4 w-4" /> {t('certificates.verifyAction')}
              </Button>
              <Button type="button" variant="ghost" className="w-full" onClick={() => navigate('dashboard')}>
                <ArrowLeft className="h-4 w-4" /> {t('certificates.backToLogin')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (notFound || !data) {
    return (
      <div className="space-y-4">
        <Button
          variant="ghost"
          onClick={handleBack}
          size="sm"
          className="print:hidden"
        >
          <ArrowLeft className="w-4 h-4" /> {user ? t('certificates.backToCerts') : t('certificates.tryAnother')}
        </Button>
        <Card className="p-12">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-20 h-20 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-rose-600" />
            </div>
            <div>
              <h3 className="font-semibold text-xl">{t('certificates.notFound')}</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-md">
                {t('certificates.notFoundDesc')}
              </p>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  if (data.status !== 'active') {
    return (
      <div className="space-y-4">
        <Button
          variant="ghost"
          onClick={handleBack}
          size="sm"
          className="print:hidden"
        >
          <ArrowLeft className="w-4 h-4" /> {user ? t('certificates.backToCerts') : t('certificates.tryAnother')}
        </Button>
        <Card className="p-12">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <ShieldAlert className="w-10 h-10 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-xl">{t('certificates.invalid')}</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-md">
                {data.status === 'revoked'
                  ? t('certificates.revokedByAdmin')
                  : t('certificates.expiredDesc')}
              </p>
              <div className="mt-3 inline-flex items-center gap-2 text-xs text-muted-foreground">
                <Hash className="w-3.5 h-3.5" />
                <span className="font-mono">{data.certNumber}</span>
              </div>
              {data.status === 'expired' && data.validUntil && (
                <p className="text-xs text-muted-foreground mt-2">
                  {t('certificates.validUntilLabel')}: {formatDate(data.validUntil)}
                </p>
              )}
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Top action bar */}
      <div className="flex items-center justify-between gap-2 print:hidden">
        <Button
          variant="ghost"
          onClick={handleBack}
          size="sm"
        >
          <ArrowLeft className="w-4 h-4" /> {user ? t('certificates.backToCerts') : t('certificates.tryAnother')}
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleCopyLink}>
            <QrCode className="w-4 h-4" /> {t('certificates.shareLink')}
          </Button>
          <Button size="sm" onClick={handlePrint}>
            <Printer className="w-4 h-4" /> {t('certificates.printPdf')}
          </Button>
        </div>
      </div>

      {/* The certificate itself */}
      <CertificateDocument data={data} hash={hash} />

      {/* Verification status banner */}
      <Card className="border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-900/10 print:hidden">
        <CardContent className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="font-semibold text-emerald-900 dark:text-emerald-100">
              {t('certificates.verified')} ✓
            </p>
            <p className="text-sm text-emerald-700 dark:text-emerald-300">
              {t('certificates.verifiedDesc')}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ============== THE FORMAL CERTIFICATE DOCUMENT ==============

function CertificateDocument({
  data,
  hash,
}: {
  data: Extract<VerifyResponse, { status: 'active' }>
  hash: string
}) {
  const { t } = useTranslation()
  const primary = data.template?.primaryColor ?? '#0f766e'
  const accent = data.template?.accentColor ?? '#ca8a04'
  const titleText = data.template?.titleText ?? t('certificates.certificate')
  const signerName = data.template?.signerName ?? '—'
  const signerTitle = data.template?.signerTitle ?? '—'

  const fullName = useMemo(() => {
    const u = data.user
    return [u.lastName, u.firstName, u.middleName].filter(Boolean).join(' ').trim()
  }, [data.user])

  const courseTitle = data.course?.title ?? t('certificates.unknownCourse')

  // QR code via qrserver.com API (no dependency, simple image)
  const verifyUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}?view=verify&hash=${hash}`
      : `https://gidroedu.uz?view=verify&hash=${hash}`
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(
    verifyUrl
  )}&color=0f766e&bgcolor=ffffff&margin=0`

  return (
    <div className="flex justify-center py-4">
      <div
        className="print-certificate relative w-full max-w-4xl bg-white shadow-xl print:shadow-none"
        style={{ aspectRatio: '1.414 / 1' }}
      >
        {/* Outer decorative border */}
        <div
          className="absolute inset-0"
          style={{
            border: `4px solid ${primary}`,
            borderRadius: '2px',
          }}
        />
        {/* Inner border */}
        <div
          className="absolute inset-2"
          style={{
            border: `1px solid ${accent}`,
            borderRadius: '2px',
          }}
        />

        {/* Corner ornaments */}
        <CornerOrnament position="top-left" color={accent} />
        <CornerOrnament position="top-right" color={accent} />
        <CornerOrnament position="bottom-left" color={accent} />
        <CornerOrnament position="bottom-right" color={accent} />

        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-between px-6 md:px-16 py-8 md:py-12 text-center">
          {/* Top: institution + title */}
          <div className="flex flex-col items-center gap-1 md:gap-2">
            <div className="flex items-center gap-2">
              <Droplets
                className="w-5 h-5 md:w-7 md:h-7"
                style={{ color: primary }}
              />
              <p
                className="text-[10px] md:text-sm font-semibold uppercase tracking-[0.2em]"
                style={{ color: primary }}
              >
                {t('app.institution')}
              </p>
            </div>
            <div
              className="h-px w-32 md:w-48"
              style={{
                background: `linear-gradient(to right, transparent, ${accent}, transparent)`,
              }}
            />
            <h1
              className="text-2xl md:text-5xl font-bold tracking-wider mt-1 md:mt-2"
              style={{
                color: primary,
                fontFamily: 'Georgia, "Times New Roman", serif',
              }}
            >
              {titleText}
            </h1>
          </div>

          {/* Middle: body text + name + course */}
          <div className="flex flex-col items-center gap-2 md:gap-3 max-w-2xl">
            <p className="text-[10px] md:text-sm text-slate-600 leading-relaxed">
              {t('certificates.thisCertifies')}
            </p>
            <p
              className="text-lg md:text-3xl font-semibold"
              style={{
                color: '#1e293b',
                fontFamily: 'Georgia, "Times New Roman", serif',
                borderBottom: `2px solid ${accent}`,
                paddingBottom: '4px',
              }}
            >
              {fullName}
            </p>
            <p className="text-[10px] md:text-sm text-slate-600 leading-relaxed">
              {t('certificates.hasCompleted')}
            </p>
            <p
              className="text-sm md:text-xl font-medium mt-1"
              style={{ color: primary }}
            >
              «{courseTitle}»
            </p>
          </div>

          {/* Bottom: score, dates, signer, QR */}
          <div className="w-full grid grid-cols-3 items-end gap-2 md:gap-6 mt-2">
            {/* Left: signer */}
            <div className="flex flex-col items-start text-left">
              <div className="text-[8px] md:text-[10px] uppercase tracking-wider text-slate-400 mb-1">
                {t('certificates.signature')}
              </div>
              <div
                className="w-full h-8 md:h-10 border-b mb-1"
                style={{ borderColor: accent }}
              />
              <p
                className="text-[10px] md:text-sm font-semibold"
                style={{ color: primary }}
              >
                {signerName}
              </p>
              <p className="text-[8px] md:text-xs text-slate-500">{signerTitle}</p>
            </div>

            {/* Center: score */}
            <div className="flex flex-col items-center gap-1">
              <div
                className="px-3 py-1.5 md:px-4 md:py-2 rounded-full flex items-center gap-1.5"
                style={{
                  background: `${primary}15`,
                  border: `1px solid ${primary}30`,
                }}
              >
                <TrendingUp
                  className="w-3 h-3 md:w-4 md:h-4"
                  style={{ color: primary }}
                />
                <span
                  className="text-sm md:text-lg font-bold"
                  style={{ color: primary }}
                >
                  {data.percentage}%
                </span>
              </div>
              <p className="text-[8px] md:text-xs text-slate-500">
                {data.score} / {data.maxScore} {t('certificates.ball')}
              </p>
            </div>

            {/* Right: QR code */}
            <div className="flex flex-col items-end gap-1">
              <div
                className="bg-white p-1 rounded shadow-sm border"
                style={{ borderColor: `${primary}30` }}
              >
                {/* QR data URLs should render directly without the image optimizer. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrSrc}
                  alt={t('certificates.qrAlt')}
                  className="w-12 h-12 md:w-16 md:h-16"
                  width={64}
                  height={64}
                />
              </div>
              <p className="text-[7px] md:text-[9px] text-slate-400 text-right max-w-[120px]">
                {t('certificates.qrHelp')}
              </p>
            </div>
          </div>

          {/* Footer strip: cert number + dates */}
          <div
            className="w-full flex flex-col md:flex-row items-center justify-between gap-1 md:gap-4 pt-2 md:pt-4 mt-1"
            style={{ borderTop: `1px solid ${primary}20` }}
          >
            <div className="flex items-center gap-1.5 text-[8px] md:text-xs text-slate-500">
              <Hash className="w-2.5 h-2.5 md:w-3 md:h-3" />
              <span className="font-mono">{data.certNumber}</span>
            </div>
            <div className="flex items-center gap-3 md:gap-6 text-[8px] md:text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-2.5 h-2.5 md:w-3 md:h-3" />
                {t('certificates.issuedLabel')}: {formatDate(data.issuedAt)}
              </span>
              {data.validUntil && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-2.5 h-2.5 md:w-3 md:h-3" />
                  {t('certificates.validLabel')}: {formatDate(data.validUntil)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Decorative corner ornament (SVG)
function CornerOrnament({
  position,
  color,
}: {
  position: CornerPosition
  color: string
}) {
  const positionClasses: Record<CornerPosition, string> = {
    'top-left': 'top-2 left-2',
    'top-right': 'top-2 right-2 rotate-90',
    'bottom-left': 'bottom-2 left-2 -rotate-90',
    'bottom-right': 'bottom-2 right-2 rotate-180',
  }
  return (
    <svg
      className={cn('absolute w-8 h-8 md:w-12 md:h-12', positionClasses[position])}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M2 2 L2 16 M2 2 L16 2 M2 8 L8 8 L8 2"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="2" cy="2" r="2" fill={color} />
    </svg>
  )
}
