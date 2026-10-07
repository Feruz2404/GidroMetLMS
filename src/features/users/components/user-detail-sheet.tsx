'use client'

import { Award, BookOpen, ClipboardCheck, GraduationCap, KeyRound, Pencil, UserCheck, UserX, type LucideIcon } from 'lucide-react'
import { ErrorState } from '@/components/shared/error-state'
import { StatusBadge } from '@/components/shared/status-badge'
import { UserAvatar } from '@/components/shared/user-avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { useSession } from '@/features/auth/session'
import { useI18n } from '@/i18n/provider'
import { cn, personName } from '@/lib/utils'
import type { UserDetailDto } from '@/shared/dto'
import { useUser } from '../api'
import { userAccess } from '../lib'
import { RoleBadge } from './role-badge'
import type { UserActionHandlers } from './user-actions-menu'

interface UserDetailSheetProps {
  userId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  actions: Omit<UserActionHandlers, 'onView'>
}

export function UserDetailSheet({ userId, open, onOpenChange, actions }: UserDetailSheetProps) {
  const { t } = useI18n()
  const user = useUser(userId)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 overflow-y-auto p-0 sm:max-w-md">
        {user.data ? (
          <UserDetail user={user.data} actions={actions} />
        ) : user.isError ? (
          <div className="p-6 pt-14">
            <SheetTitle className="sr-only">{t('users.actions.details')}</SheetTitle>
            <SheetDescription className="sr-only">{t('state.error')}</SheetDescription>
            <ErrorState error={user.error} onRetry={() => user.refetch()} />
          </div>
        ) : (
          <DetailSkeleton />
        )}
      </SheetContent>
    </Sheet>
  )
}

function UserDetail({ user, actions }: { user: UserDetailDto; actions: UserDetailSheetProps['actions'] }) {
  const { t, formatDate, formatRelative, formatNumber } = useI18n()
  const { user: me } = useSession()
  const access = userAccess(me, user)

  const stats: Array<{ label: string; value: number; icon: LucideIcon; tone: string }> = [
    { label: t('users.detail.enrollments'), value: user.stats.enrollments, icon: BookOpen, tone: 'bg-primary/10 text-primary' },
    { label: t('users.detail.completed'), value: user.stats.completedCourses, icon: GraduationCap, tone: 'bg-success/12 text-success' },
    { label: t('users.detail.certificates'), value: user.stats.certificates, icon: Award, tone: 'bg-chart-3/15 text-[color:var(--chart-3)]' },
    { label: t('users.detail.attempts'), value: user.stats.quizAttempts, icon: ClipboardCheck, tone: 'bg-chart-5/12 text-chart-5' },
  ]

  const details: Array<[string, React.ReactNode]> = [
    [t('auth.field.username'), <span key="username" className="font-mono text-[0.8rem]">{user.username}</span>],
    [t('common.phone'), user.phone ?? t('common.none')],
    [t('common.department'), user.department ?? t('common.none')],
    [t('common.position'), user.position ?? t('common.none')],
    [t('users.column.lastLogin'), user.lastLoginAt ? `${formatRelative(user.lastLoginAt)} · ${formatDate(user.lastLoginAt, 'datetime')}` : t('users.never')],
    [t('users.detail.createdAt'), formatDate(user.createdAt, 'long')],
  ]

  return (
    <>
      <SheetHeader className="gap-3 border-b bg-muted/40 px-6 pb-5 pt-6">
        <UserAvatar user={user} className="size-14 [&_[data-slot=avatar-fallback]]:text-lg" />
        <div className="min-w-0 space-y-0.5 pr-6">
          <SheetTitle className="text-lg leading-snug">{personName(user, true)}</SheetTitle>
          <SheetDescription className="truncate">{user.email}</SheetDescription>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <RoleBadge role={user.role} />
          <StatusBadge status={user.isActive ? 'active' : 'inactive'} />
          {user.mustChangePassword && (
            <Badge variant="warning">
              <KeyRound aria-hidden="true" />
              {t('users.mustChange')}
            </Badge>
          )}
        </div>
      </SheetHeader>

      <div className="flex-1 space-y-6 px-6 py-6">
        <section className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('users.detail.learning')}</h3>
          <ul className="grid grid-cols-2 gap-3">
            {stats.map((stat) => (
              <li key={stat.label} className="flex items-center gap-3 rounded-lg border bg-card p-3">
                <span className={cn('flex size-9 shrink-0 items-center justify-center rounded-lg', stat.tone)}>
                  <stat.icon className="size-4" aria-hidden="true" />
                </span>
                <p className="flex min-w-0 flex-col">
                  <span className="text-lg font-semibold leading-tight tabular-nums">{formatNumber(stat.value)}</span>
                  <span className="truncate text-xs text-muted-foreground">{stat.label}</span>
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('users.detail.account')}</h3>
          <dl className="divide-y rounded-lg border">
            {details.map(([label, value]) => (
              <div key={label} className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-3 px-3.5 py-2.5 text-sm">
                <dt className="text-muted-foreground">{label}</dt>
                <dd className="min-w-0 break-words">{value}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      {(access.canEdit || access.canResetPassword || access.canToggleStatus) && (
        <div className="sticky bottom-0 flex flex-wrap gap-2 border-t bg-background px-6 py-4">
          {access.canEdit && (
            <Button variant="outline" size="sm" onClick={() => actions.onEdit(user)}>
              <Pencil aria-hidden="true" />
              {t('action.edit')}
            </Button>
          )}
          {access.canResetPassword && (
            <Button variant="outline" size="sm" onClick={() => actions.onResetPassword(user)}>
              <KeyRound aria-hidden="true" />
              {t('users.actions.resetPassword')}
            </Button>
          )}
          {access.canToggleStatus && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => actions.onToggleStatus(user)}
              className={user.isActive ? 'text-destructive hover:bg-destructive/10 hover:text-destructive' : undefined}
            >
              {user.isActive ? <UserX aria-hidden="true" /> : <UserCheck aria-hidden="true" />}
              {user.isActive ? t('users.actions.deactivate') : t('users.actions.activate')}
            </Button>
          )}
        </div>
      )}
    </>
  )
}

function DetailSkeleton() {
  const { t } = useI18n()
  return (
    <div className="space-y-6 p-6" aria-busy="true">
      <SheetTitle className="sr-only">{t('state.loading')}</SheetTitle>
      <SheetDescription className="sr-only">{t('state.loading')}</SheetDescription>
      <Skeleton className="size-14 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-4 w-56" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-16 rounded-lg" />
        ))}
      </div>
      <Skeleton className="h-56 rounded-lg" />
    </div>
  )
}
