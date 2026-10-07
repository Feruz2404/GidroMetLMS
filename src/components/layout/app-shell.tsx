'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet'
import { useSession } from '@/features/auth/session'
import { useI18n } from '@/i18n/provider'
import { routes } from '@/lib/routes'
import { cn } from '@/lib/utils'
import { useStoredFlag } from '@/hooks/use-stored-flag'
import { AppSidebar } from './app-sidebar'
import { CommandSearch } from './command-search'
import { NotificationBell } from './notification-bell'
import { ThemeToggle } from './theme-toggle'
import { UserMenu } from './user-menu'

const COLLAPSED_KEY = 'gidroedu.sidebar.collapsed'

export function AppShell({ children }: { children: React.ReactNode }) {
  const { t } = useI18n()
  const { user } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useStoredFlag(COLLAPSED_KEY)
  const [mobileOpen, setMobileOpen] = useState(false)

  // Accounts with a temporary password must change it before using the app.
  useEffect(() => {
    if (user.mustChangePassword && pathname !== '/settings') router.replace(routes.settings('security'))
  }, [user.mustChangePassword, pathname, router])

  const toggle = () => setCollapsed(!collapsed)

  return (
    <div className="min-h-dvh bg-background">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground">
        {t('nav.skipToContent')}
      </a>

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 hidden border-r border-sidebar-border transition-[width] duration-200 lg:block',
          collapsed ? 'w-[76px]' : 'w-[264px]'
        )}
      >
        <AppSidebar collapsed={collapsed} onToggle={toggle} />
      </aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[280px] border-0 p-0">
          <SheetTitle className="sr-only">{t('app.fullName')}</SheetTitle>
          <SheetDescription className="sr-only">{t('app.tagline')}</SheetDescription>
          <AppSidebar onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className={cn('flex min-h-dvh flex-col transition-[padding] duration-200', collapsed ? 'lg:pl-[76px]' : 'lg:pl-[264px]')}>
        <header className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)} aria-label={t('nav.openMenu')}>
              <Menu className="size-5" />
            </Button>
            <div className="min-w-0 flex-1">
              <CommandSearch />
            </div>
            <div className="flex items-center gap-1">
              <ThemeToggle className="hidden sm:inline-flex" />
              <NotificationBell />
              <div className="ml-1">
                <UserMenu />
              </div>
            </div>
          </div>
        </header>

        <main id="main" className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>

        <footer className="border-t px-4 py-5 text-xs text-muted-foreground sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-[1440px] flex-col gap-1 sm:flex-row sm:justify-between">
            <span>{t('app.copyright', { year: new Date().getFullYear() })}</span>
            <span>{t('app.institution')}</span>
          </div>
        </footer>
      </div>
    </div>
  )
}
