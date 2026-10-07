'use client'

import { Palette, ShieldAlert, ShieldCheck, UserRound } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useSession } from '@/features/auth/session'
import { useUrlState } from '@/hooks/use-url-state'
import { useI18n } from '@/i18n/provider'
import { PreferencesTab } from './components/preferences-tab'
import { ProfileTab } from './components/profile-tab'
import { SecurityTab } from './components/security-tab'

const TABS = ['profile', 'security', 'preferences'] as const
type SettingsTab = (typeof TABS)[number]

const isTab = (value: string): value is SettingsTab => (TABS as readonly string[]).includes(value)

export function SettingsPage() {
  const { t } = useI18n()
  const { user } = useSession()
  const [state, setState] = useUrlState({ tab: user.mustChangePassword ? 'security' : 'profile' })
  const tab: SettingsTab = isTab(state.tab) ? state.tab : 'profile'

  return (
    <div>
      <PageHeader title={t('settings.page.title')} description={t('settings.page.description')} />

      {user.mustChangePassword && (
        <div role="alert" className="mb-6 flex gap-4 rounded-xl border border-warning/50 bg-warning/10 p-4 sm:p-5">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-warning/25 text-warning-foreground dark:text-warning">
            <ShieldAlert className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0 space-y-1">
            <p className="font-semibold">{t('settings.mustChange.title')}</p>
            <p className="text-sm text-muted-foreground">{t('settings.mustChange.description')}</p>
          </div>
        </div>
      )}

      <Tabs value={tab} onValueChange={(next) => setState({ tab: next })} className="gap-6">
        <TabsList className="grid h-10 w-full grid-cols-3 sm:inline-flex sm:w-fit">
          <TabsTrigger value="profile" className="px-3">
            <UserRound aria-hidden="true" className="hidden min-[400px]:block" />
            {t('settings.tab.profile')}
          </TabsTrigger>
          <TabsTrigger value="security" className="px-3">
            <ShieldCheck aria-hidden="true" className="hidden min-[400px]:block" />
            {t('settings.tab.security')}
          </TabsTrigger>
          <TabsTrigger value="preferences" className="px-3">
            <Palette aria-hidden="true" className="hidden min-[400px]:block" />
            {t('settings.tab.preferences')}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <ProfileTab />
        </TabsContent>
        <TabsContent value="security">
          <SecurityTab />
        </TabsContent>
        <TabsContent value="preferences">
          <PreferencesTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
