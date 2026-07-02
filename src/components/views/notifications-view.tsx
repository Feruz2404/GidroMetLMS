'use client'

import { useEffect, useState, useCallback } from 'react'
import { api, timeAgo, type Notification } from '@/lib/api'
import { useNav } from '@/store/auth'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Bell, BellOff, CheckCheck, Info, CheckCircle2, AlertTriangle, XCircle, Loader2 } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

const TYPE_ICONS: Record<string, typeof Info> = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
}

const TYPE_COLORS: Record<string, string> = {
  info: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  success: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  warning: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  error: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
}

// Notification links are stored as bare view names. Only navigate to views the
// app can actually render, so a stray/legacy link value can't blank the page.
const NAVIGABLE_VIEWS = new Set([
  'dashboard', 'courses', 'quizzes', 'library',
  'certificates', 'reports', 'users', 'settings', 'notifications',
])

export function NotificationsView() {
  const { t } = useTranslation()
  const navigate = useNav((s) => s.navigate)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const [loading, setLoading] = useState(true)

  const fetchNotifs = useCallback(async () => {
    Promise.resolve().then(() => setLoading(true))
    try {
      const res = await api.get<{ data: { notifications: Notification[]; unreadCount: number } }>(`/notifications?filter=${filter}`)
      setNotifications(res.data.notifications ?? [])
      setUnreadCount(res.data.unreadCount ?? 0)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    fetchNotifs()
  }, [fetchNotifs])

  const markAllRead = async () => {
    try {
      await api.post('/notifications')
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
      setUnreadCount(0)
    } catch {
      // ignore
    }
  }

  const markRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}`)
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
      setUnreadCount((c) => Math.max(0, c - 1))
    } catch {
      // ignore
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bell className="w-6 h-6" /> {t('notifications.title')}
            {unreadCount > 0 && <Badge>{unreadCount} {t('notifications.unread')}</Badge>}
          </h1>
          <p className="text-muted-foreground">{t('notifications.subtitle')}</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllRead}>
            <CheckCheck className="w-4 h-4 mr-2" /> {t('notifications.markAllRead')}
          </Button>
        )}
      </div>

      <Tabs value={filter} onValueChange={(v) => setFilter(v as 'all' | 'unread')}>
        <TabsList>
          <TabsTrigger value="all">{t('notifications.all')} ({notifications.length})</TabsTrigger>
          <TabsTrigger value="unread">{t('notifications.unread')} ({unreadCount})</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-2">
        {loading ? (
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin mr-2" /> {t('common.loading')}
          </div>
        ) : notifications.length === 0 ? (
          <Card>
            <CardContent className="py-16 flex flex-col items-center text-center text-muted-foreground">
              <BellOff className="w-12 h-12 mb-3 opacity-30" />
              <p className="font-medium">{filter === 'unread' ? t('notifications.noUnread') : t('notifications.noNotifications')}</p>
              <p className="text-sm mt-1">{t('notifications.willAppear')}</p>
            </CardContent>
          </Card>
        ) : (
          notifications.map((n) => {
            const Icon = TYPE_ICONS[n.type] ?? Info
            return (
              <Card
                key={n.id}
                className={`cursor-pointer transition-colors hover:bg-accent/50 ${!n.isRead ? 'border-primary/40 bg-primary/5' : ''}`}
                onClick={() => {
                  if (!n.isRead) markRead(n.id)
                  if (n.link && NAVIGABLE_VIEWS.has(n.link)) navigate(n.link)
                }}
              >
                <CardContent className="p-4 flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${TYPE_COLORS[n.type] ?? TYPE_COLORS.info}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{n.title}</span>
                      {!n.isRead && <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">{n.message}</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">{timeAgo(n.createdAt)}</p>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
