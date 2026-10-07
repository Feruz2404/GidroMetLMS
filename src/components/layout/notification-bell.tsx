'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Bell, CheckCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { NotificationIcon } from '@/components/shared/notification-icon'
import { useI18n } from '@/i18n/provider'
import { api } from '@/lib/api-client'
import { resolveAppLink, routes } from '@/lib/routes'
import { cn } from '@/lib/utils'
import type { NotificationDto, NotificationListDto } from '@/shared/dto'

export const notificationKeys = {
  all: ['notifications'] as const,
  list: (filter: string) => ['notifications', 'list', filter] as const,
  summary: ['notifications', 'summary'] as const,
}

export function NotificationBell() {
  const { t, formatRelative } = useI18n()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data } = useQuery({
    queryKey: notificationKeys.summary,
    queryFn: () => api.get<NotificationListDto>('/notifications', { limit: 8 }),
    refetchInterval: 60_000,
  })
  const invalidate = () => queryClient.invalidateQueries({ queryKey: notificationKeys.all })
  const markAll = useMutation({ mutationFn: () => api.post('/notifications'), onSuccess: invalidate })
  const open = useMutation({
    mutationFn: (notification: NotificationDto) => (notification.isRead ? Promise.resolve(null) : api.patch(`/notifications/${notification.id}`, {})),
    onSuccess: invalidate,
  })

  const unread = data?.unreadCount ?? 0

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label={`${t('nav.notifications')}${unread ? ` (${unread})` : ''}`}>
          <Bell className="size-[18px]" />
          {unread > 0 && (
            <span className="absolute right-1 top-1 flex min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold leading-4 text-white tabular-nums">
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[22rem] p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <p className="font-semibold">{t('nav.notifications')}</p>
          {unread > 0 && (
            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => markAll.mutate()} disabled={markAll.isPending}>
              <CheckCheck aria-hidden="true" />
              {t('action.markAllRead')}
            </Button>
          )}
        </div>
        <div className="scrollbar-thin max-h-96 overflow-y-auto">
          {data?.items.length ? (
            data.items.map((notification) => (
              <button
                key={notification.id}
                type="button"
                onClick={() => {
                  open.mutate(notification)
                  const link = resolveAppLink(notification.link)
                  if (link) router.push(link)
                }}
                className={cn('flex w-full gap-3 border-b px-4 py-3 text-left transition-colors last:border-0 hover:bg-muted/60', !notification.isRead && 'bg-primary/[0.04]')}
              >
                <NotificationIcon type={notification.type} />
                <div className="min-w-0 flex-1">
                  <p className={cn('truncate text-sm', !notification.isRead && 'font-semibold')}>{notification.title}</p>
                  <p className="line-clamp-2 text-xs text-muted-foreground">{notification.message}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">{formatRelative(notification.createdAt)}</p>
                </div>
                {!notification.isRead && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" aria-hidden="true" />}
              </button>
            ))
          ) : (
            <p className="px-4 py-10 text-center text-sm text-muted-foreground">{t('state.empty')}</p>
          )}
        </div>
        <div className="border-t p-2">
          <Button asChild variant="ghost" size="sm" className="w-full">
            <Link href={routes.notifications}>{t('action.seeAll')}</Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
