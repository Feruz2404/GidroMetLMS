'use client'

import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { useI18n } from '@/i18n/provider'
import { useErrorToast } from '@/lib/use-api-error'
import { personName } from '@/lib/utils'
import type { UserListItemDto } from '@/shared/dto'
import { useSetUserStatus } from '../api'

interface UserStatusDialogProps {
  user: UserListItemDto | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

/** Confirms activating or deactivating an account (deactivation also ends its sessions). */
export function UserStatusDialog({ user, open, onOpenChange }: UserStatusDialogProps) {
  const { t } = useI18n()
  const setStatus = useSetUserStatus()
  const errorToast = useErrorToast()
  if (!user) return null

  const activate = !user.isActive
  const name = personName(user)

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      destructive={!activate}
      title={activate ? t('users.activate.title', { name }) : t('users.deactivate.title', { name })}
      description={activate ? t('users.activate.description') : t('users.deactivate.description')}
      confirmLabel={activate ? t('users.actions.activate') : t('users.actions.deactivate')}
      onConfirm={async () => {
        try {
          await setStatus.mutateAsync({ id: user.id, isActive: activate })
          toast.success(activate ? t('users.toast.activated', { name }) : t('users.toast.deactivated', { name }))
        } catch (error) {
          errorToast(error)
        }
      }}
    />
  )
}
