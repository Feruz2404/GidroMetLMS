'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { AlertCircle, Award, Loader2, LogIn } from 'lucide-react'
import { toast } from 'sonner'
import { Logo } from '@/components/brand/logo'
import { LocaleSwitcher } from '@/components/layout/locale-switcher'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { Field } from '@/components/shared/field'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useI18n } from '@/i18n/provider'
import { api } from '@/lib/api-client'
import { routes } from '@/lib/routes'
import { useErrorMessage } from '@/lib/use-api-error'
import type { CurrentUserDto } from '@/shared/dto'
import { PasswordInput } from './password-input'

/** Only same-origin relative paths are accepted as post-login destinations. */
function safeNext(next: string | null): string {
  return next && next.startsWith('/') && !next.startsWith('//') && !next.startsWith('/login') ? next : routes.dashboard
}

export function LoginForm({ registrationOpen }: { registrationOpen: boolean }) {
  const { t } = useI18n()
  const router = useRouter()
  const searchParams = useSearchParams()
  const errorMessage = useErrorMessage()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const expired = searchParams.get('expired') === '1'

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)
    setPending(true)
    try {
      const user = await api.post<CurrentUserDto>('/auth', { email, password })
      toast.success(t('auth.welcome', { name: user.firstName }))
      router.replace(user.mustChangePassword ? routes.settings('security') : safeNext(searchParams.get('next')))
      router.refresh()
    } catch (reason) {
      setError(errorMessage(reason))
      setPending(false)
    }
  }

  return (
    <div className="w-full max-w-[400px]">
      <div className="mb-10 flex items-center justify-between lg:hidden">
        <Logo />
        <div className="flex items-center gap-1">
          <LocaleSwitcher />
          <ThemeToggle />
        </div>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">{t('auth.login.title')}</h1>
        <p className="text-sm text-muted-foreground">{t('auth.login.subtitle')}</p>
      </div>

      {expired && !error && (
        <p className="mt-6 rounded-lg border border-warning/40 bg-warning/10 px-3 py-2.5 text-sm">{t('auth.login.sessionExpired')}</p>
      )}

      <form onSubmit={submit} className="mt-8 space-y-5" noValidate>
        <Field id="email" label={t('auth.field.email')}>
          <Input
            id="email"
            type="email"
            autoComplete="username"
            inputMode="email"
            required
            autoFocus
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={t('auth.field.emailPlaceholder')}
            className="h-11"
          />
        </Field>
        <Field id="password" label={t('auth.field.password')}>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-11"
          />
        </Field>

        {error && (
          <p role="alert" className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-sm text-destructive">
            <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            {error}
          </p>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={pending || !email || !password}>
          {pending ? <Loader2 className="animate-spin" aria-hidden="true" /> : <LogIn aria-hidden="true" />}
          {pending ? t('auth.login.submitting') : t('auth.login.submit')}
        </Button>
      </form>

      {registrationOpen && (
        <p className="mt-6 text-center text-sm text-muted-foreground">
          {t('auth.login.noAccount')}{' '}
          <Link href={routes.register} className="font-medium text-primary hover:underline">
            {t('auth.login.register')}
          </Link>
        </p>
      )}

      <div className="mt-8 space-y-4 border-t pt-6">
        <Button asChild variant="outline" className="w-full">
          <Link href={routes.verify()}>
            <Award aria-hidden="true" />
            {t('auth.login.verifyCertificate')}
          </Link>
        </Button>
        <p className="text-center text-xs leading-5 text-muted-foreground">{t('auth.login.accessNote')}</p>
      </div>
    </div>
  )
}
