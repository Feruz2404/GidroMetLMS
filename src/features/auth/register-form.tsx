'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AlertCircle, Loader2, UserPlus } from 'lucide-react'
import { toast } from 'sonner'
import { Logo } from '@/components/brand/logo'
import { LocaleSwitcher } from '@/components/layout/locale-switcher'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { Field } from '@/components/shared/field'
import { FilterSelect } from '@/components/shared/filter-select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useI18n } from '@/i18n/provider'
import { api, ApiError } from '@/lib/api-client'
import { routes } from '@/lib/routes'
import { useErrorMessage } from '@/lib/use-api-error'
import type { CurrentUserDto, DepartmentDto } from '@/shared/dto'
import { PasswordChecklist, PasswordInput, passwordMeetsPolicy } from './password-input'

const EMPTY = {
  lastName: '',
  firstName: '',
  middleName: '',
  email: '',
  username: '',
  phone: '',
  department: '',
  position: '',
  password: '',
  confirm: '',
}

export function RegisterForm({ open, departments }: { open: boolean; departments: DepartmentDto[] }) {
  const { t } = useI18n()
  const router = useRouter()
  const errorMessage = useErrorMessage()
  const [form, setForm] = useState(EMPTY)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [pending, setPending] = useState(false)

  const set = (key: keyof typeof EMPTY) => (event: React.ChangeEvent<HTMLInputElement>) => setForm((current) => ({ ...current, [key]: event.target.value }))

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)
    const errors: Record<string, string> = {}
    if (!form.firstName.trim()) errors.firstName = t('validation.required')
    if (!form.lastName.trim()) errors.lastName = t('validation.required')
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = t('validation.invalidEmail')
    if (!/^[a-zA-Z0-9._-]{3,64}$/.test(form.username)) errors.username = t('auth.field.usernameHint')
    if (!passwordMeetsPolicy(form.password)) errors.password = t('errors.WEAK_PASSWORD')
    if (form.password !== form.confirm) errors.confirm = t('validation.passwordMismatch')
    setFieldErrors(errors)
    if (Object.keys(errors).length) return

    setPending(true)
    try {
      const { confirm: _confirm, ...payload } = form
      const user = await api.post<CurrentUserDto>('/auth/register', payload)
      toast.success(t('auth.register.success'))
      router.replace(user.mustChangePassword ? routes.settings('security') : routes.dashboard)
      router.refresh()
    } catch (reason) {
      setError(errorMessage(reason))
      if (reason instanceof ApiError) {
        setFieldErrors(Object.fromEntries(reason.issues.map((issue) => [issue.path, issue.message.startsWith('PASSWORD_') ? t(`validation.${issue.message}` as never) : issue.message])))
      }
      setPending(false)
    }
  }

  return (
    <div className="w-full max-w-[520px]">
      <div className="mb-8 flex items-center justify-between lg:hidden">
        <Logo />
        <div className="flex items-center gap-1">
          <LocaleSwitcher />
          <ThemeToggle />
        </div>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">{t('auth.register.title')}</h1>
        <p className="text-sm text-muted-foreground">{t('auth.register.subtitle')}</p>
      </div>

      {!open ? (
        <div className="mt-8 space-y-6">
          <p className="rounded-lg border bg-muted/50 px-4 py-3 text-sm">{t('auth.register.closed')}</p>
          <Button asChild variant="outline" className="w-full">
            <Link href={routes.login()}>{t('auth.register.signIn')}</Link>
          </Button>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-8 space-y-6" noValidate>
          <fieldset className="space-y-4">
            <legend className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('auth.register.personal')}</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="lastName" label={t('auth.field.lastName')} required error={fieldErrors.lastName}>
                <Input id="lastName" autoComplete="family-name" value={form.lastName} onChange={set('lastName')} />
              </Field>
              <Field id="firstName" label={t('auth.field.firstName')} required error={fieldErrors.firstName}>
                <Input id="firstName" autoComplete="given-name" value={form.firstName} onChange={set('firstName')} />
              </Field>
            </div>
            <Field id="middleName" label={t('auth.field.middleName')}>
              <Input id="middleName" autoComplete="additional-name" value={form.middleName} onChange={set('middleName')} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="email" label={t('auth.field.email')} required error={fieldErrors.email}>
                <Input id="email" type="email" autoComplete="email" value={form.email} onChange={set('email')} placeholder={t('auth.field.emailPlaceholder')} />
              </Field>
              <Field id="phone" label={t('auth.field.phone')}>
                <Input id="phone" type="tel" autoComplete="tel" value={form.phone} onChange={set('phone')} placeholder="+998 90 123 45 67" />
              </Field>
            </div>
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('auth.register.work')}</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="department" label={t('auth.field.department')}>
                <FilterSelect
                  value={form.department}
                  onChange={(value) => setForm((current) => ({ ...current, department: value }))}
                  options={departments.map((department) => ({ value: department.name, label: department.name }))}
                  placeholder={t('auth.field.departmentPlaceholder')}
                  ariaLabel={t('auth.field.department')}
                  className="h-9 w-full sm:w-full"
                />
              </Field>
              <Field id="position" label={t('auth.field.position')}>
                <Input id="position" autoComplete="organization-title" value={form.position} onChange={set('position')} />
              </Field>
            </div>
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('auth.register.security')}</legend>
            <Field id="username" label={t('auth.field.username')} required hint={t('auth.field.usernameHint')} error={fieldErrors.username}>
              <Input id="username" autoComplete="username" value={form.username} onChange={set('username')} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="password" label={t('auth.field.password')} required error={fieldErrors.password}>
                <PasswordInput id="password" autoComplete="new-password" value={form.password} onChange={set('password')} />
              </Field>
              <Field id="confirm" label={t('auth.field.confirmPassword')} required error={fieldErrors.confirm}>
                <PasswordInput id="confirm" autoComplete="new-password" value={form.confirm} onChange={set('confirm')} />
              </Field>
            </div>
            <PasswordChecklist value={form.password} />
          </fieldset>

          {error && (
            <p role="alert" className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-sm text-destructive">
              <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              {error}
            </p>
          )}

          <Button type="submit" size="lg" className="w-full" disabled={pending}>
            {pending ? <Loader2 className="animate-spin" aria-hidden="true" /> : <UserPlus aria-hidden="true" />}
            {pending ? t('auth.register.submitting') : t('auth.register.submit')}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            {t('auth.register.haveAccount')}{' '}
            <Link href={routes.login()} className="font-medium text-primary hover:underline">
              {t('auth.register.signIn')}
            </Link>
          </p>
        </form>
      )}
    </div>
  )
}
