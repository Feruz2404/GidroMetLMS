'use client'

import { useRouter } from 'next/navigation'
import { ArrowUpRight, Check, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { NotificationIcon } from '@/components/shared/notification-icon'
import { Button } from '@/components/ui/button'
import { INTL_LOCALE } from '@/i18n/config'
import { useI18n } from '@/i18n/provider'
import { resolveAppLink } from '@/lib/routes'
import { useErrorToast } from '@/lib/use-api-error'
import { cn } from '@/lib/utils'
import type { NotificationDto } from '@/shared/dto'
import { useDeleteNotification, useMarkNotificationRead } from '../api'

interface DayGroup {
  key: string
  date: Date
  items: NotificationDto[]
}

const dayKey = (date: Date) => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`

/** Groups notifications (already newest first) by local calendar day. */
function groupByDay(items: NotificationDto[]): DayGroup[] {
  const groups: DayGroup[] = []
  for (const item of items) {
    const date = new Date(item.createdAt)
    const key = dayKey(date)
    const last = groups[groups.length - 1]
    if (last?.key === key) last.items.push(item)
    else groups.push({ key, date, items: [item] })
  }
  return groups
}

export function NotificationList({ items }: { items: NotificationDto[] }) {
  const { t, formatDate } = useI18n()
  const today = new Date()
  const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1)

  const label = (group: DayGroup) => {
    if (group.key === dayKey(today)) return t('time.today')
    if (group.key === dayKey(yesterday)) return t('time.yesterday')
    return formatDate(group.date, 'long')
  }

  return (
    <div className="space-y-6">
      {groupByDay(items).map((group) => (
        <section key={group.key} aria-labelledby={`day-${group.key}`} className="space-y-2.5">
          <h2 id={`day-${group.key}`} className="px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {label(group)}
          </h2>
          <ul className="divide-y overflow-hidden rounded-xl border bg-card shadow-[var(--shadow-card)]">
            {group.items.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} isToday={group.key === dayKey(today)} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

function NotificationItem({ notification, isToday }: { notification: NotificationDto; isToday: boolean }) {
  const { t, locale, formatRelative, formatDate } = useI18n()
  const router = useRouter()
  const markRead = useMarkNotificationRead()
  const remove = useDeleteNotification()
  const errorToast = useErrorToast()
  const link = resolveAppLink(notification.link)
  const unread = !notification.isRead

  const time = isToday
    ? formatRelative(notification.createdAt)
    : new Intl.DateTimeFormat(INTL_LOCALE[locale], { hour: '2-digit', minute: '2-digit' }).format(new Date(notification.createdAt))

  const open = () => {
    if (unread) markRead.mutate(notification.id, { onError: errorToast })
    if (link) router.push(link)
  }

  return (
    <li className={cn('group relative flex gap-3 px-4 py-4 transition-colors hover:bg-muted/50 sm:gap-4 sm:px-5', unread && 'bg-primary/[0.035]')}>
      {unread && <span className="absolute inset-y-3 left-0 w-[3px] rounded-r-full bg-primary" aria-hidden="true" />}
      <NotificationIcon type={notification.type} className="size-9" />
      <button
        type="button"
        onClick={open}
        className="min-w-0 flex-1 text-left outline-none after:absolute after:inset-0 after:content-[''] focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-ring"
      >
        {/* Right padding keeps the title clear of the action buttons; the message below uses the full width. */}
        <span className="flex min-h-7 flex-wrap items-center gap-x-2 pr-16">
          <span className={cn('text-sm', unread ? 'font-semibold' : 'font-medium')}>{notification.title}</span>
          {unread && <span className="sr-only">({t('notifications.unread')})</span>}
        </span>
        <span className="mt-0.5 block max-w-3xl whitespace-pre-line text-sm text-muted-foreground">{notification.message}</span>
        <span className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
          <time dateTime={notification.createdAt} title={formatDate(notification.createdAt, 'datetime')}>
            {time}
          </time>
          {link && <ArrowUpRight className="size-3.5 text-primary" aria-hidden="true" />}
        </span>
      </button>
      <div className="absolute right-2 top-3.5 z-10 flex items-center gap-0.5 transition-opacity sm:right-3 sm:opacity-0 sm:group-focus-within:opacity-100 sm:group-hover:opacity-100">
        {unread && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => markRead.mutate(notification.id, { onError: errorToast })}
            disabled={markRead.isPending}
            aria-label={t('notifications.markRead')}
            title={t('notifications.markRead')}
          >
            <Check aria-hidden="true" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          onClick={() =>
            remove.mutate(notification.id, {
              onSuccess: () => toast.success(t('notifications.deleted')),
              onError: errorToast,
            })
          }
          disabled={remove.isPending}
          aria-label={t('notifications.delete')}
          title={t('notifications.delete')}
        >
          <Trash2 aria-hidden="true" />
        </Button>
      </div>
      {unread && (
        <span className="absolute right-6 top-[1.6rem] hidden size-2 rounded-full bg-primary sm:block sm:group-focus-within:hidden sm:group-hover:hidden" aria-hidden="true" />
      )}
    </li>
  )
}
