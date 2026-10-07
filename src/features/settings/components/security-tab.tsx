'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Fingerprint, KeyRound, Loader2, LogOut, MessageSquareLock, ShieldCheck, type LucideIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Field } from '@/components/shared/field'
import { SectionCard } from '@/components/shared/section-card'
import { Button } from '@/components/ui/button'
import { PasswordChecklist, PasswordInput, passwordMeetsPolicy } from '@/features/auth/password-input'
import { useSession } from '@/features/auth/session'
import type { MessageKey } from '@/i18n'
import { useI18n } from '@/i18n/provider'
import { ApiError } from '@/lib/api-client'
import { routes } from '@/lib/routes'
import { useErrorToast } from '@/lib/use-api-error'
import { useChangePassword } from '../api'

const TIPS: Array<{ icon: LucideIcon; key: MessageKey }> = [
  { icon: Fingerprint, key: 'settings.security.tip.unique' },
  { icon: KeyRound, key: 'settings.security.tip.phrase' },
  { icon: MessageSquareLock, key: 'settings.security.tip.secret' },
  { icon: LogOut, key: 'settings.security.tip.device' },
]

export function SecurityTab() {
  const { t } = useI18n()
  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <SectionCard title={t('settings.security.title')} description={t('settings.security.description')}>
        <ChangePasswordForm />
      </SectionCard>
      <section className="rounded-xl border bg-card p-5 shadow-[var(--shadow-card)]" aria-labelledby="password-tips-title">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-lg bg-success/12 text-success">
            <ShieldCheck className="size-5" aria-hidden="true" />
          </span>
          <h2 id="password-tips-title" className="font-semibold tracking-tight">
            {t('settings.security.tipsTitle')}
          </h2>
        </div>
        <ul className="mt-4 space-y-3.5">
          {TIPS.map((tip) => (
            <li key={tip.key} className="flex gap-3 text-sm text-muted-foreground">
              <tip.icon className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              {t(tip.key)}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

const EMPTY = { currentPassword: '', newPassword: '', confirm: '' }
type PasswordField = keyof typeof EMPTY

function ChangePasswordForm() {
  const { t } = useI18n()
  const router = useRouter()
  const { user } = useSession()
  const change = useChangePassword()
  const errorToast = useErrorToast()
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<PasswordField, string>>>({})

  const field = (key: PasswordField) => ({
    id: `security-${key}`,
    value: values[key],
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value
      setValues((current) => ({ ...current, [key]: value }))
      setErrors((current) => ({ ...current, [key]: undefined }))
    },
    'aria-invalid': Boolean(errors[key]),
    'aria-describedby': errors[key] ? `security-${key}-error` : undefined,
  })

  const serverErrors = (error: unknown): Partial<Record<PasswordField, string>> | null => {
    if (!(error instanceof ApiError)) return null
    if (error.code === 'INVALID_CREDENTIALS') return { currentPassword: t('settings.security.currentWrong') }
    // Policy violations are caught by validation first, so WEAK_PASSWORD here means "same as the current one".
    if (error.code === 'WEAK_PASSWORD') return { newPassword: t('settings.security.samePassword') }
    if (error.code === 'VALIDATION_FAILED' && error.issues.length) {
      return Object.fromEntries(
        error.issues.map((issue) => [
          issue.path,
          issue.message.startsWith('PASSWORD_') ? t(`validation.${issue.message}` as MessageKey) : t('validation.required'),
        ])
      )
    }
    return null
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    const found: typeof errors = {}
    if (!values.currentPassword) found.currentPassword = t('validation.required')
    if (!passwordMeetsPolicy(values.newPassword)) found.newPassword = t('errors.WEAK_PASSWORD')
    if (values.confirm !== values.newPassword) found.confirm = t('validation.passwordMismatch')
    setErrors(found)
    if (Object.keys(found).length) return

    const forced = user.mustChangePassword
    try {
      await change.mutateAsync({ currentPassword: values.currentPassword, newPassword: values.newPassword })
      toast.success(t('settings.security.success'), { description: t('settings.security.successHint') })
      setValues(EMPTY)
      if (forced) router.replace(routes.dashboard)
    } catch (error) {
      const mapped = serverErrors(error)
      if (mapped) setErrors(mapped)
      else errorToast(error)
    }
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <Field
        id="security-currentPassword"
        label={t('settings.security.current')}
        required
        hint={user.mustChangePassword ? t('settings.security.currentTemporary') : undefined}
        error={errors.currentPassword}
      >
        <PasswordInput autoComplete="current-password" {...field('currentPassword')} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="security-newPassword" label={t('settings.security.new')} required error={errors.newPassword}>
          <PasswordInput autoComplete="new-password" {...field('newPassword')} />
        </Field>
        <Field id="security-confirm" label={t('settings.security.confirm')} required error={errors.confirm}>
          <PasswordInput autoComplete="new-password" {...field('confirm')} />
        </Field>
      </div>
      <PasswordChecklist value={values.newPassword} />
      <div className="flex justify-end border-t pt-5">
        <Button type="submit" disabled={change.isPending} className="w-full sm:w-auto">
          {change.isPending ? <Loader2 className="animate-spin" aria-hidden="true" /> : <KeyRound aria-hidden="true" />}
          {t('settings.security.submit')}
        </Button>
      </div>
    </form>
  )
}
