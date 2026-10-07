import type { Metadata } from 'next'
import { NotificationsPage } from '@/features/notifications/notifications-page'

export const metadata: Metadata = { title: 'Bildirishnomalar' }

export default function Page() {
  return <NotificationsPage />
}
