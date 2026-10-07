'use client'

import { KeyRound } from 'lucide-react'
import { DataTable, type Column } from '@/components/shared/data-table'
import { StatusBadge } from '@/components/shared/status-badge'
import { UserAvatar } from '@/components/shared/user-avatar'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useSession } from '@/features/auth/session'
import { useI18n } from '@/i18n/provider'
import { personName } from '@/lib/utils'
import type { UserListItemDto } from '@/shared/dto'
import { userAccess } from '../lib'
import { RoleBadge } from './role-badge'
import { UserActionsMenu, type UserActionHandlers } from './user-actions-menu'

interface UserTableProps {
  rows: UserListItemDto[] | undefined
  loading: boolean
  empty: React.ReactNode
  actions: UserActionHandlers
}

export function UserTable({ rows, loading, empty, actions }: UserTableProps) {
  const { t, formatRelative, formatDate } = useI18n()
  const { user: me } = useSession()

  const columns: Column<UserListItemDto>[] = [
    {
      key: 'user',
      header: t('users.column.user'),
      // On phones the cell takes the remaining width and truncates instead of forcing horizontal scroll.
      className: 'w-full max-w-0 md:w-auto md:min-w-56 md:max-w-80',
      cell: (user) => (
        <div className="flex min-w-0 items-center gap-3">
          <UserAvatar user={user} className={user.isActive ? undefined : 'opacity-60'} />
          <div className="min-w-0">
            <div className="flex min-w-0 items-center gap-1.5">
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  actions.onView(user)
                }}
                className="truncate text-left font-medium outline-none hover:text-primary focus-visible:text-primary focus-visible:underline"
              >
                {personName(user)}
              </button>
              {user.id === me.id && <Badge variant="brand" className="px-1.5 py-0 text-[0.7rem]">{t('users.you')}</Badge>}
            </div>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            <RoleBadge role={user.role} className="mt-1.5 md:hidden" />
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: t('common.role'),
      hideOnMobile: true,
      cell: (user) => <RoleBadge role={user.role} />,
    },
    {
      key: 'department',
      header: t('users.column.department'),
      hideOnMobile: true,
      className: 'max-w-64',
      cell: (user) =>
        user.department || user.position ? (
          <div className="min-w-0">
            <p className="truncate text-sm">{user.department ?? t('common.none')}</p>
            {user.position && <p className="truncate text-xs text-muted-foreground">{user.position}</p>}
          </div>
        ) : (
          <span className="text-muted-foreground">{t('common.none')}</span>
        ),
    },
    {
      key: 'status',
      header: t('common.status'),
      cell: (user) => (
        <div className="flex items-center gap-1.5">
          <StatusBadge status={user.isActive ? 'active' : 'inactive'} />
          {user.isActive && user.mustChangePassword && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span tabIndex={0} className="flex size-6 items-center justify-center rounded-full bg-warning/15 text-warning-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring dark:text-warning">
                  <KeyRound className="size-3.5" aria-hidden="true" />
                  <span className="sr-only">{t('users.mustChange')}</span>
                </span>
              </TooltipTrigger>
              <TooltipContent>{t('users.mustChange')}</TooltipContent>
            </Tooltip>
          )}
        </div>
      ),
    },
    {
      key: 'lastLogin',
      header: t('users.column.lastLogin'),
      hideOnMobile: true,
      cell: (user) =>
        user.lastLoginAt ? (
          <time dateTime={user.lastLoginAt} title={formatDate(user.lastLoginAt, 'datetime')} className="whitespace-nowrap text-sm text-muted-foreground">
            {formatRelative(user.lastLoginAt)}
          </time>
        ) : (
          <span className="whitespace-nowrap text-sm text-muted-foreground">{t('users.never')}</span>
        ),
    },
    {
      key: 'actions',
      header: <span className="sr-only">{t('common.actions')}</span>,
      className: 'w-12',
      cell: (user) => <UserActionsMenu user={user} access={userAccess(me, user)} actions={actions} />,
    },
  ]

  return <DataTable columns={columns} rows={rows} rowKey={(user) => user.id} loading={loading} empty={empty} onRowClick={actions.onView} />
}
