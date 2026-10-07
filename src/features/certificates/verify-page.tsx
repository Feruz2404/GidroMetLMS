'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BadgeCheck, KeyRound, QrCode, ScanSearch, ShieldCheck } from 'lucide-react'
import { Field } from '@/components/shared/field'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useI18n } from '@/i18n/provider'
import { routes } from '@/lib/routes'
import { extractVerificationCode } from './verification-code'

export function VerifyPage() {
  const { t } = useI18n()
  const router = useRouter()
  const [value, setValue] = useState('')
  const [error, setError] = useState<string | null>(null)

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    const code = extractVerificationCode(value)
    if (!code) {
      setError(value.trim() ? t('certificates.verify.invalid') : t('validation.required'))
      return
    }
    setError(null)
    router.push(routes.verify(code))
  }

  const steps = [
    { icon: QrCode, title: t('certificates.verify.step1.title'), text: t('certificates.verify.step1.text') },
    { icon: KeyRound, title: t('certificates.verify.step2.title'), text: t('certificates.verify.step2.text') },
    { icon: BadgeCheck, title: t('certificates.verify.step3.title'), text: t('certificates.verify.step3.text') },
  ]

  return (
    <section className="mx-auto max-w-2xl">
      <div className="text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <ShieldCheck className="size-7" aria-hidden="true" />
        </span>
        <h1 className="mt-5 text-2xl font-semibold tracking-tight text-balance sm:text-3xl">{t('certificates.verify.title')}</h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground sm:text-[0.95rem]">{t('certificates.verify.description')}</p>
      </div>

      <form onSubmit={submit} noValidate className="mt-8 rounded-xl border bg-card p-5 shadow-[var(--shadow-card)] sm:p-6">
        <Field id="verify-code" label={t('certificates.verify.code')} hint={t('certificates.verify.hint')} error={error}>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              id="verify-code"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder={t('certificates.verify.placeholder')}
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'verify-code-error' : 'verify-code-hint'}
              className="h-11 font-mono text-sm sm:flex-1"
            />
            <Button type="submit" size="lg" className="sm:w-auto">
              <ScanSearch aria-hidden="true" />
              {t('certificates.verify.submit')}
            </Button>
          </div>
        </Field>
      </form>

      <ol className="mt-8 grid gap-4 sm:grid-cols-3">
        {steps.map((step, index) => (
          <li key={step.title} className="rounded-xl border bg-card/60 p-4">
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <step.icon className="size-4" aria-hidden="true" />
              </span>
              <span className="text-xs font-semibold text-muted-foreground tabular-nums">0{index + 1}</span>
            </div>
            <p className="mt-3 text-sm font-semibold">{step.title}</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
