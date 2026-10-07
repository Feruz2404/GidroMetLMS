'use client'

import { useState } from 'react'
import { KeyRound, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { passwordMeetsPolicy } from '@/features/auth/password-input'
import { useI18n } from '@/i18n/provider'
import { useErrorToast } from '@/lib/use-api-error'
import { personName } from '@/lib/utils'
import type { UserListItemDto } from '@/shared/dto'
import { useResetUserPassword } from '../api'
import { useFieldIssues } from '../hooks'
import { TemporaryPasswordField } from './temporary-password-field'

interface ResetPasswordDialogProps {
  user: UserListItemDto | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ResetPasswordDialog({ user, open, onOpenChange }: ResetPasswordDialogProps) {
  const { t } = useI18n()
  if (!user) return null
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t('users.reset.title')}</DialogTitle>
          <DialogDescription>{t('users.reset.description', { name: personName(user) })}</DialogDescription>
        </DialogHeader>
        <ResetPasswordForm key={user.id} user={user} onDone={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}

function ResetPasswordForm({ user, onDone }: { user: UserListItemDto; onDone: () => void }) {
  const { t } = useI18n()
  const reset = useResetUserPassword()
  const errorToast = useErrorToast()
  const fieldIssues = useFieldIssues()
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!passwordMeetsPolicy(password)) {
      setError(t('errors.WEAK_PASSWORD'))
      return
    }
    setError(null)
    try {
      await reset.mutateAsync({ id: user.id, password })
      toast.success(t('users.toast.passwordReset'), { description: t('users.toast.passwordResetHint') })
      onDone()
    } catch (reason) {
      const issue = fieldIssues(reason).password
      if (issue) setError(issue)
      else errorToast(reason)
    }
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-6">
      <TemporaryPasswordField
        id="reset-password"
        value={password}
        onChange={(value) => {
          setPassword(value)
          setError(null)
        }}
        error={error}
      />
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline" disabled={reset.isPending}>
            {t('action.cancel')}
          </Button>
        </DialogClose>
        <Button type="submit" disabled={reset.isPending}>
          {reset.isPending ? <Loader2 className="animate-spin" aria-hidden="true" /> : <KeyRound aria-hidden="true" />}
          {t('users.reset.submit')}
        </Button>
      </DialogFooter>
    </form>
  )
}
