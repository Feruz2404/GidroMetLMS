'use client'

import { useState } from 'react'
import { BellOff, CheckCheck, Megaphone, PartyPopper } from 'lucide-react'
import { toast } from 'sonner'
import { EmptyState } from '@/components/shared/empty-state'
import { ErrorState } from '@/components/shared/error-state'
import { PageHeader } from '@/components/shared/page-header'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useSession } from '@/features/auth/session'
import { useUrlState } from '@/hooks/use-url-state'
import { useI18n } from '@/i18n/provider'
import { useErrorToast } from '@/lib/use-api-error'
import { cn } from '@/lib/utils'
import { PERMISSIONS } from '@/shared/roles'
import { NOTIFICATION_LIMIT, useMarkAllNotificationsRead, useNotifications, type NotificationFilter } from './api'
import { AnnouncementDialog } from './components/announcement-dialog'
import { NotificationList } from './components/notification-list'

export function NotificationsPage() {
  const { t, formatNumber } = useI18n()
  const { can } = useSession()
  const errorToast = useErrorToast()
  const [state, setState] = useUrlState({ filter: 'all' })
  const filter: NotificationFilter = state.filter === 'unread' ? 'unread' : 'all'
  // The "all" list is always loaded: it also provides the tab counts.
  const all = useNotifications('all')
  const unread = useNotifications('unread', filter === 'unread')
  const current = filter === 'unread' ? unread : all
  const markAll = useMarkAllNotificationsRead()
  const [announcing, setAnnouncing] = useState(false)
  const canAnnounce = can(PERMISSIONS.ANNOUNCEMENTS_MANAGE)

  const unreadCount = current.data?.unreadCount ?? all.data?.unreadCount ?? 0
  const allCount = all.data?.items.length

  return (
    <div>
      <PageHeader
        title={t('notifications.page.title')}
        description={t('notifications.page.description')}
        actions={
          <>
            <Button
              variant="outline"
              disabled={unreadCount === 0 || markAll.isPending}
              onClick={() =>
                markAll.mutate(undefined, {
                  onSuccess: () => toast.success(t('notifications.allRead')),
                  onError: errorToast,
                })
              }
            >
              <CheckCheck aria-hidden="true" />
              {t('action.markAllRead')}
            </Button>
            {canAnnounce && (
              <Button onClick={() => setAnnouncing(true)}>
                <Megaphone aria-hidden="true" />
                {t('notifications.announce.open')}
              </Button>
            )}
          </>
        }
      />

      <Tabs value={filter} onValueChange={(next) => setState({ filter: next })} className="mb-6">
        <TabsList className="h-10">
          <TabsTrigger value="all" className="px-3">
            {t('notifications.tab.all')}
            {allCount !== undefined && (
              <CountPill>{`${formatNumber(allCount)}${allCount >= NOTIFICATION_LIMIT ? '+' : ''}`}</CountPill>
            )}
          </TabsTrigger>
          <TabsTrigger value="unread" className="px-3">
            {t('notifications.tab.unread')}
            {current.data && <CountPill highlight={unreadCount > 0}>{formatNumber(unreadCount)}</CountPill>}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {current.isPending ? (
        <ListSkeleton />
      ) : current.isError ? (
        <ErrorState error={current.error} onRetry={() => current.refetch()} />
      ) : current.data.items.length === 0 ? (
        filter === 'unread' ? (
          <EmptyState icon={PartyPopper} title={t('notifications.emptyUnread')} description={t('notifications.emptyUnreadHint')} />
        ) : (
          <EmptyState icon={BellOff} title={t('notifications.empty')} description={t('notifications.emptyHint')} />
        )
      ) : (
        <NotificationList items={current.data.items} />
      )}

      {canAnnounce && <AnnouncementDialog open={announcing} onOpenChange={setAnnouncing} />}
    </div>
  )
}

function CountPill({ children, highlight = false }: { children: React.ReactNode; highlight?: boolean }) {
  return (
    <span
      className={cn(
        'min-w-5 rounded-full px-1.5 text-center text-xs font-semibold leading-5 tabular-nums',
        highlight ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground/12 text-muted-foreground'
      )}
    >
      {children}
    </span>
  )
}

function ListSkeleton() {
  return (
    <div className="space-y-2.5" aria-busy="true">
      <Skeleton className="h-3 w-20" />
      <div className="divide-y rounded-xl border bg-card">
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="flex gap-4 px-5 py-4">
            <Skeleton className="size-9 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
