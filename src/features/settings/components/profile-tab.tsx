'use client'

import { useState } from 'react'
import { AtSign, Briefcase, Building2, CalendarDays, Clock, Loader2, Lock, Mail, Save, type LucideIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Field } from '@/components/shared/field'
import { SectionCard } from '@/components/shared/section-card'
import { UserAvatar } from '@/components/shared/user-avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useSession } from '@/features/auth/session'
import type { MessageKey } from '@/i18n'
import { useI18n } from '@/i18n/provider'
import { ApiError } from '@/lib/api-client'
import { useErrorToast } from '@/lib/use-api-error'
import { personName } from '@/lib/utils'
import type { CurrentUserDto } from '@/shared/dto'
import type { ProfileUpdateInput } from '@/shared/schemas'
import { useUpdateProfile } from '../api'

export function ProfileTab() {
  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
      <AccountCard />
      <ProfileForm />
    </div>
  )
}

function AccountCard() {
  const { t, formatDate, formatRelative } = useI18n()
  const { user } = useSession()

  const rows: Array<{ icon: LucideIcon; label: string; value: React.ReactNode }> = [
    { icon: Mail, label: t('common.email'), value: user.email },
    { icon: AtSign, label: t('auth.field.username'), value: <span className="font-mono text-[0.8rem]">{user.username}</span> },
    { icon: Building2, label: t('common.department'), value: user.department ?? t('settings.profile.notAssigned') },
    { icon: Briefcase, label: t('common.position'), value: user.position ?? t('settings.profile.notAssigned') },
    // Rendered on the server too: the clock and time zone can differ from the browser's, so the text may change on hydration.
    {
      icon: CalendarDays,
      label: t('settings.profile.memberSince'),
      value: (
        <time dateTime={user.createdAt} suppressHydrationWarning>
          {formatDate(user.createdAt, 'long')}
        </time>
      ),
    },
    {
      icon: Clock,
      label: t('settings.profile.lastLogin'),
      value: user.lastLoginAt ? (
        <time dateTime={user.lastLoginAt} title={formatDate(user.lastLoginAt, 'datetime')} suppressHydrationWarning>
          {formatRelative(user.lastLoginAt)}
        </time>
      ) : (
        t('common.none')
      ),
    },
  ]

  return (
    <section className="overflow-hidden rounded-xl border bg-card shadow-[var(--shadow-card)]" aria-labelledby="account-card-title">
      <div className="h-20 bg-gradient-to-br from-primary via-primary/80 to-chart-2" aria-hidden="true" />
      <div className="px-5 pb-5">
        <UserAvatar user={user} className="-mt-10 size-20 ring-4 ring-card [&_[data-slot=avatar-fallback]]:text-2xl" />
        <h2 id="account-card-title" className="mt-3 text-lg font-semibold leading-snug tracking-tight">
          {personName(user, true)}
        </h2>
        <Badge variant="brand" className="mt-1.5">
          {t(`role.${user.role}` as MessageKey)}
        </Badge>

        <dl className="mt-5 space-y-3.5 text-sm">
          {rows.map((row) => (
            <div key={row.label} className="flex gap-3">
              <row.icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <div className="min-w-0">
                <dt className="text-xs text-muted-foreground">{row.label}</dt>
                <dd className="break-words font-medium">{row.value}</dd>
              </div>
            </div>
          ))}
        </dl>

        <p className="mt-5 flex gap-2 rounded-lg bg-muted/70 p-3 text-xs leading-relaxed text-muted-foreground">
          <Lock className="mt-px size-3.5 shrink-0" aria-hidden="true" />
          {t('settings.profile.accountHint')}
        </p>
      </div>
    </section>
  )
}

type ProfileValues = Record<'lastName' | 'firstName' | 'middleName' | 'phone' | 'position', string>

function toValues(user: CurrentUserDto): ProfileValues {
  return {
    lastName: user.lastName,
    firstName: user.firstName,
    middleName: user.middleName ?? '',
    phone: user.phone ?? '',
    position: user.position ?? '',
  }
}

function changedFields(user: CurrentUserDto, values: ProfileValues): ProfileUpdateInput {
  const changes: ProfileUpdateInput = {}
  if (values.lastName.trim() !== user.lastName) changes.lastName = values.lastName.trim()
  if (values.firstName.trim() !== user.firstName) changes.firstName = values.firstName.trim()
  for (const key of ['middleName', 'phone', 'position'] as const) {
    const value = values[key].trim() || null
    if (value !== user[key]) changes[key] = value
  }
  return changes
}

function ProfileForm() {
  const { t } = useI18n()
  const { user } = useSession()
  const update = useUpdateProfile()
  const errorToast = useErrorToast()
  const [values, setValues] = useState(() => toValues(user))
  const [errors, setErrors] = useState<Partial<Record<keyof ProfileValues, string>>>({})

  const changes = changedFields(user, values)
  const dirty = Object.keys(changes).length > 0

  const field = (key: keyof ProfileValues) => ({
    id: `profile-${key}`,
    value: values[key],
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value
      setValues((current) => ({ ...current, [key]: value }))
      setErrors((current) => ({ ...current, [key]: undefined }))
    },
    'aria-invalid': Boolean(errors[key]),
    'aria-describedby': errors[key] ? `profile-${key}-error` : undefined,
  })

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    const found: typeof errors = {}
    if (!values.lastName.trim()) found.lastName = t('validation.required')
    if (!values.firstName.trim()) found.firstName = t('validation.required')
    setErrors(found)
    if (Object.keys(found).length || !dirty) return
    try {
      const saved = await update.mutateAsync(changes)
      setValues(toValues(saved))
      toast.success(t('settings.profile.saved'))
    } catch (error) {
      if (error instanceof ApiError && error.issues.length) {
        setErrors(Object.fromEntries(error.issues.map((issue) => [issue.path, t('errors.VALIDATION_FAILED')])))
      } else {
        errorToast(error)
      }
    }
  }

  return (
    <SectionCard title={t('settings.profile.personal')} description={t('settings.profile.personalHint')}>
      <form onSubmit={submit} noValidate className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="profile-lastName" label={t('auth.field.lastName')} required error={errors.lastName}>
            <Input autoComplete="family-name" {...field('lastName')} />
          </Field>
          <Field id="profile-firstName" label={t('auth.field.firstName')} required error={errors.firstName}>
            <Input autoComplete="given-name" {...field('firstName')} />
          </Field>
          <Field id="profile-middleName" label={t('auth.field.middleName')} error={errors.middleName}>
            <Input autoComplete="additional-name" {...field('middleName')} />
          </Field>
          <Field id="profile-phone" label={t('auth.field.phone')} error={errors.phone}>
            <Input type="tel" autoComplete="tel" placeholder="+998 90 123 45 67" {...field('phone')} />
          </Field>
          <Field id="profile-position" label={t('auth.field.position')} error={errors.position} className="sm:col-span-2">
            <Input autoComplete="organization-title" {...field('position')} />
          </Field>
        </div>
        <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-end">
          {dirty && <p className="text-sm text-muted-foreground sm:mr-auto">{t('state.unsavedChanges')}</p>}
          {dirty && (
            <Button type="button" variant="ghost" onClick={() => setValues(toValues(user))} disabled={update.isPending}>
              {t('action.cancel')}
            </Button>
          )}
          <Button type="submit" disabled={!dirty || update.isPending}>
            {update.isPending ? <Loader2 className="animate-spin" aria-hidden="true" /> : <Save aria-hidden="true" />}
            {t('action.saveChanges')}
          </Button>
        </div>
      </form>
    </SectionCard>
  )
}
