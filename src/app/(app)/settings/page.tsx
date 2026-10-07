import type { Metadata } from 'next'
import { SettingsPage } from '@/features/settings/settings-page'

export const metadata: Metadata = { title: 'Sozlamalar' }

export default function Page() {
  return <SettingsPage />
}
