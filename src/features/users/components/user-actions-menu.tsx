'use client'

import { Eye, KeyRound, MoreHorizontal, Pencil, UserCheck, UserX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useI18n } from '@/i18n/provider'
import { personName } from '@/lib/utils'
import type { UserListItemDto } from '@/shared/dto'
import type { UserAccess } from '../lib'

export interface UserActionHandlers {
  onView: (user: UserListItemDto) => void
  onEdit: (user: UserListItemDto) => void
  onResetPassword: (user: UserListItemDto) => void
  onToggleStatus: (user: UserListItemDto) => void
}

export function UserActionsMenu({ user, access, actions }: { user: UserListItemDto; access: UserAccess; actions: UserActionHandlers }) {
  const { t } = useI18n()
  return (
    // Menu items render in a portal but still bubble through the React tree; keep them from triggering the row click.
    <div className="flex justify-end" onClick={(event) => event.stopPropagation()}>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label={t('users.actions.menu', { name: personName(user) })}>
            <MoreHorizontal aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuItem onSelect={() => actions.onView(user)}>
            <Eye aria-hidden="true" />
            {t('users.actions.details')}
          </DropdownMenuItem>
          {access.canEdit && (
            <DropdownMenuItem onSelect={() => actions.onEdit(user)}>
              <Pencil aria-hidden="true" />
              {t('action.edit')}
            </DropdownMenuItem>
          )}
          {access.canResetPassword && (
            <DropdownMenuItem onSelect={() => actions.onResetPassword(user)}>
              <KeyRound aria-hidden="true" />
              {t('users.actions.resetPassword')}
            </DropdownMenuItem>
          )}
          {access.canToggleStatus && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant={user.isActive ? 'destructive' : 'default'} onSelect={() => actions.onToggleStatus(user)}>
                {user.isActive ? <UserX aria-hidden="true" /> : <UserCheck aria-hidden="true" />}
                {user.isActive ? t('users.actions.deactivate') : t('users.actions.activate')}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
