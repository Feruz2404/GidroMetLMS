'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { notificationKeys } from '@/components/layout/notification-bell'
import { api } from '@/lib/api-client'
import type { NotificationDto, NotificationListDto } from '@/shared/dto'
import type { AnnouncementInput } from '@/shared/schemas'

export type NotificationFilter = 'all' | 'unread'

/** The API caps a page at 100 items; the page shows the most recent ones. */
export const NOTIFICATION_LIMIT = 100

export function useNotifications(filter: NotificationFilter, enabled = true) {
  return useQuery({
    queryKey: notificationKeys.list(filter),
    queryFn: () => api.get<NotificationListDto>('/notifications', { filter, limit: NOTIFICATION_LIMIT }),
    enabled,
  })
}

// Every mutation refreshes all notification queries, including the top-bar bell.
function useInvalidateNotifications() {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: notificationKeys.all })
}

export function useMarkNotificationRead() {
  const invalidate = useInvalidateNotifications()
  return useMutation({
    mutationFn: (id: string) => api.patch<NotificationDto>(`/notifications/${id}`, {}),
    onSuccess: invalidate,
  })
}

export function useMarkAllNotificationsRead() {
  const invalidate = useInvalidateNotifications()
  return useMutation({
    mutationFn: () => api.post<{ updated: number }>('/notifications'),
    onSuccess: invalidate,
  })
}

export function useDeleteNotification() {
  const invalidate = useInvalidateNotifications()
  return useMutation({
    mutationFn: (id: string) => api.delete<{ deleted: boolean }>(`/notifications/${id}`),
    onSuccess: invalidate,
  })
}

export function usePublishAnnouncement() {
  const invalidate = useInvalidateNotifications()
  return useMutation({
    mutationFn: (input: AnnouncementInput) => api.post<{ recipients: number }>('/announcements', input),
    onSuccess: invalidate,
  })
}
