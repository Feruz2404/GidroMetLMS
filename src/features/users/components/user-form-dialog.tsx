'use client'

import { useState } from 'react'
import { AlertCircle, Loader2, Save, UserPlus } from 'lucide-react'
import { toast } from 'sonner'
import { Field } from '@/components/shared/field'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useSession } from '@/features/auth/session'
import { passwordMeetsPolicy } from '@/features/auth/password-input'
import type { MessageKey } from '@/i18n'
import { useI18n } from '@/i18n/provider'
import { useErrorMessage } from '@/lib/use-api-error'
import { personName } from '@/lib/utils'
import type { UserListItemDto } from '@/shared/dto'
import { ASSIGNABLE_ROLES, ROLES, type AssignableRole } from '@/shared/roles'
import type { UpdateUserInput } from '@/shared/schemas'
import { useCreateUser, useDepartments, useUpdateUser } from '../api'
import { useFieldIssues } from '../hooks'
import { EMAIL_PATTERN, suggestUsername, USERNAME_PATTERN, userAccess } from '../lib'
import { TemporaryPasswordField } from './temporary-password-field'

interface UserFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** The account to edit; omit to create a new one. */
  user?: UserListItemDto | null
}

export function UserFormDialog({ open, onOpenChange, user }: UserFormDialogProps) {
  const { t } = useI18n()
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{user ? t('users.form.editTitle') : t('users.form.createTitle')}</DialogTitle>
          <DialogDescription>
            {user ? t('users.form.editDescription', { name: personName(user) }) : t('users.form.createDescription')}
          </DialogDescription>
        </DialogHeader>
        <UserForm key={user?.id ?? 'new'} user={user ?? null} onDone={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}

interface Values {
  lastName: string
  firstName: string
  middleName: string
  phone: string
  email: string
  username: string
  password: string
  role: string
  department: string
  position: string
}

const NO_DEPARTMENT = '__none__'

function initialValues(user: UserListItemDto | null): Values {
  return {
    lastName: user?.lastName ?? '',
    firstName: user?.firstName ?? '',
    middleName: user?.middleName ?? '',
    phone: user?.phone ?? '',
    email: user?.email ?? '',
    username: user?.username ?? '',
    password: '',
    role: user?.role ?? ROLES.LEARNER,
    department: user?.department ?? '',
    position: user?.position ?? '',
  }
}

const orNull = (value: string) => value.trim() || null

/** Only the fields that actually changed, so unchanged data (and the role) is never re-sent. */
function changedFields(user: UserListItemDto, values: Values, canChangeRole: boolean): UpdateUserInput {
  const changes: UpdateUserInput = {}
  if (values.lastName.trim() !== user.lastName) changes.lastName = values.lastName.trim()
  if (values.firstName.trim() !== user.firstName) changes.firstName = values.firstName.trim()
  for (const key of ['middleName', 'phone', 'department', 'position'] as const) {
    const value = orNull(values[key])
    if (value !== user[key]) changes[key] = value
  }
  if (canChangeRole && values.role !== user.role) changes.role = values.role as AssignableRole
  return changes
}

function UserForm({ user, onDone }: { user: UserListItemDto | null; onDone: () => void }) {
  const { t } = useI18n()
  const { user: me } = useSession()
  const departments = useDepartments()
  const createUser = useCreateUser()
  const updateUser = useUpdateUser()
  const fieldIssues = useFieldIssues()
  const errorMessage = useErrorMessage()
  const [values, setValues] = useState(() => initialValues(user))
  const [usernameEdited, setUsernameEdited] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState<string | null>(null)

  const access = user ? userAccess(me, user) : null
  const changes = user ? changedFields(user, values, Boolean(access?.canChangeRole)) : null
  const pending = createUser.isPending || updateUser.isPending

  /** Applies a change and clears the errors of the edited fields. */
  const update = (patch: Partial<Values>) => {
    setValues((current) => ({ ...current, ...patch }))
    setErrors((current) => {
      const next = { ...current }
      for (const key of Object.keys(patch)) delete next[key]
      return next
    })
  }

  const text = (key: keyof Values) => ({
    value: values[key],
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => update({ [key]: event.target.value }),
    'aria-invalid': Boolean(errors[key]),
    'aria-describedby': errors[key] ? `user-${key}-error` : undefined,
  })

  const departmentOptions = (departments.data ?? []).map((department) => department.name)
  if (values.department && !departmentOptions.includes(values.department)) departmentOptions.unshift(values.department)

  const validate = (): Record<string, string> => {
    const found: Record<string, string> = {}
    if (!values.lastName.trim()) found.lastName = t('validation.required')
    if (!values.firstName.trim()) found.firstName = t('validation.required')
    if (!user) {
      if (!EMAIL_PATTERN.test(values.email.trim())) found.email = t('validation.invalidEmail')
      if (!USERNAME_PATTERN.test(values.username.trim().toLowerCase())) found.username = t('auth.field.usernameHint')
      if (!passwordMeetsPolicy(values.password)) found.password = t('errors.WEAK_PASSWORD')
    }
    return found
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setFormError(null)
    const found = validate()
    setErrors(found)
    if (Object.keys(found).length) return

    try {
      if (user && changes) {
        await updateUser.mutateAsync({ id: user.id, input: changes })
        toast.success(t('users.toast.updated'))
      } else {
        const created = await createUser.mutateAsync({
          email: values.email.trim().toLowerCase(),
          username: values.username.trim().toLowerCase(),
          password: values.password,
          role: values.role as AssignableRole,
          lastName: values.lastName.trim(),
          firstName: values.firstName.trim(),
          middleName: orNull(values.middleName),
          phone: orNull(values.phone),
          department: orNull(values.department),
          position: orNull(values.position),
        })
        toast.success(t('users.toast.created', { name: personName(created) }), { description: t('users.toast.createdHint') })
      }
      onDone()
    } catch (error) {
      const issues = fieldIssues(error)
      setErrors(issues)
      if (!Object.keys(issues).length) setFormError(errorMessage(error))
    }
  }

  const roleHint = access && !access.canChangeRole ? (access.isSelf ? t('users.form.roleSelf') : t('users.form.roleLocked')) : undefined

  return (
    <form onSubmit={submit} noValidate className="space-y-6">
      <fieldset className="space-y-4">
        <legend className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('users.form.personal')}</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="user-lastName" label={t('auth.field.lastName')} required error={errors.lastName}>
            <Input id="user-lastName" autoComplete="off" {...text('lastName')} />
          </Field>
          <Field id="user-firstName" label={t('auth.field.firstName')} required error={errors.firstName}>
            <Input id="user-firstName" autoComplete="off" {...text('firstName')} />
          </Field>
          <Field id="user-middleName" label={t('auth.field.middleName')} error={errors.middleName}>
            <Input id="user-middleName" autoComplete="off" {...text('middleName')} />
          </Field>
          <Field id="user-phone" label={t('auth.field.phone')} error={errors.phone}>
            <Input id="user-phone" type="tel" autoComplete="off" placeholder="+998 90 123 45 67" {...text('phone')} />
          </Field>
        </div>
      </fieldset>

      {!user && (
        <fieldset className="space-y-4">
          <legend className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('users.form.access')}</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="user-email" label={t('auth.field.email')} required error={errors.email}>
              <Input
                id="user-email"
                type="email"
                autoComplete="off"
                placeholder={t('auth.field.emailPlaceholder')}
                {...text('email')}
                onChange={(event) => {
                  const email = event.target.value
                  update(usernameEdited ? { email } : { email, username: suggestUsername(email) })
                }}
              />
            </Field>
            <Field id="user-username" label={t('auth.field.username')} required hint={t('users.form.usernameHint')} error={errors.username}>
              <Input
                id="user-username"
                autoComplete="off"
                spellCheck={false}
                {...text('username')}
                onChange={(event) => {
                  setUsernameEdited(true)
                  update({ username: event.target.value })
                }}
              />
            </Field>
          </div>
          <TemporaryPasswordField
            id="user-password"
            value={values.password}
            onChange={(password) => update({ password })}
            error={errors.password}
          />
        </fieldset>
      )}

      <fieldset className="space-y-4">
        <legend className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('users.form.work')}</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="user-role" label={t('common.role')} required hint={roleHint} error={errors.role}>
            {access && !access.canChangeRole ? (
              <Input id="user-role" value={t(`role.${values.role}` as MessageKey)} disabled readOnly />
            ) : (
              <Select value={values.role} onValueChange={(role) => update({ role })}>
                <SelectTrigger id="user-role" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ASSIGNABLE_ROLES.map((role) => (
                    <SelectItem key={role} value={role}>
                      {t(`role.${role}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </Field>
          <Field id="user-department" label={t('auth.field.department')} error={errors.department}>
            <Select
              value={values.department || NO_DEPARTMENT}
              onValueChange={(department) => update({ department: department === NO_DEPARTMENT ? '' : department })}
            >
              <SelectTrigger id="user-department" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NO_DEPARTMENT}>{t('users.form.noDepartment')}</SelectItem>
                {departmentOptions.map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field id="user-position" label={t('auth.field.position')} error={errors.position} className="sm:col-span-2">
            <Input id="user-position" autoComplete="off" {...text('position')} />
          </Field>
        </div>
      </fieldset>

      {formError && (
        <p role="alert" className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-sm text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {formError}
        </p>
      )}

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline" disabled={pending}>
            {t('action.cancel')}
          </Button>
        </DialogClose>
        <Button type="submit" disabled={pending || (changes !== null && Object.keys(changes).length === 0)}>
          {pending ? <Loader2 className="animate-spin" aria-hidden="true" /> : user ? <Save aria-hidden="true" /> : <UserPlus aria-hidden="true" />}
          {user ? t('action.saveChanges') : t('users.form.submitCreate')}
        </Button>
      </DialogFooter>
    </form>
  )
}
