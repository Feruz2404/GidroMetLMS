'use client'

import { useState } from 'react'
import { useAuth, useNav } from '@/store/auth'
import { useTranslation } from '@/lib/i18n'
import { LanguageSwitcher } from '@/components/app/language-switcher'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  LayoutDashboard,
  BookOpen,
  FileQuestion,
  Library,
  Award,
  BarChart3,
  Users,
  Settings,
  LogOut,
  Menu,
  Droplets,
  Bell,
  Search,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItem {
  id: string
  labelKey: string
  icon: typeof LayoutDashboard
  roles: string[]
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', labelKey: 'nav.dashboard', icon: LayoutDashboard, roles: ['admin', 'tutor', 'student'] },
  { id: 'courses', labelKey: 'nav.courses', icon: BookOpen, roles: ['admin', 'tutor', 'student'] },
  { id: 'quizzes', labelKey: 'nav.quizzes', icon: FileQuestion, roles: ['admin', 'tutor', 'student'] },
  { id: 'library', labelKey: 'nav.library', icon: Library, roles: ['admin', 'tutor', 'student'] },
  { id: 'certificates', labelKey: 'nav.certificates', icon: Award, roles: ['admin', 'tutor', 'student'] },
  { id: 'reports', labelKey: 'nav.reports', icon: BarChart3, roles: ['admin', 'tutor'] },
  { id: 'users', labelKey: 'nav.users', icon: Users, roles: ['admin'] },
  { id: 'settings', labelKey: 'nav.settings', icon: Settings, roles: ['admin', 'tutor', 'student'] },
]

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const user = useAuth((s) => s.user)
  const view = useNav((s) => s.view)
  const navigate = useNav((s) => s.navigate)
  const { t } = useTranslation()

  if (!user) return null

  const items = NAV_ITEMS.filter((i) => i.roles.includes(user.role))

  return (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-sidebar-border">
        <div className="w-10 h-10 rounded-xl bg-sidebar-primary/20 backdrop-blur flex items-center justify-center ring-1 ring-sidebar-primary/30">
          <Droplets className="w-6 h-6 text-sidebar-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-bold leading-tight text-sidebar-foreground">{t('app.name')}</h1>
          <p className="text-xs text-sidebar-foreground/60 truncate">{t('app.institution')}</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto scroll-area px-3 py-4 space-y-1">
        {items.map((item) => {
          const Icon = item.icon
          const active = view === item.id || (item.id === 'courses' && view.startsWith('course'))
          return (
            <button
              key={item.id}
              onClick={() => {
                navigate(item.id)
                onNavigate?.()
              }}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                active
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                  : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{t(item.labelKey)}</span>
            </button>
          )
        })}
      </nav>

      {/* User */}
      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg">
          <Avatar className="w-9 h-9 ring-2 ring-sidebar-primary/30">
            <AvatarFallback className="bg-sidebar-primary/20 text-sidebar-primary text-xs font-semibold">
              {user.firstName[0]}{user.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-sidebar-foreground truncate">
              {user.firstName} {user.lastName}
            </div>
            <div className="text-xs text-sidebar-foreground/60 truncate">{t(`role.${user.role}`)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const user = useAuth((s) => s.user)
  const logout = useAuth((s) => s.logout)
  const view = useNav((s) => s.view)
  const navigate = useNav((s) => s.navigate)
  const { t } = useTranslation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  if (!user) return null

  const currentNav = NAV_ITEMS.find((i) => i.id === view)
  const pageTitle = currentNav ? t(currentNav.labelKey) : t('nav.dashboard')

  const handleLogout = async () => {
    try {
      await logout()
    } catch (e) {
      console.error('Logout error:', e)
      useAuth.setState({ user: null })
      useNav.setState({ view: 'dashboard', params: {} })
    }
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 flex-shrink-0 sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SidebarContent onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
          <div className="flex items-center gap-3 px-4 lg:px-6 h-16">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
            </Sheet>

            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold truncate">{pageTitle}</h2>
            </div>

            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(!searchOpen)}
                className="hidden sm:flex"
                aria-label={t('common.search')}
              >
                <Search className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('notifications')}
                className="relative"
                aria-label={t('nav.notifications')}
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
              </Button>
              <Badge variant="secondary" className="hidden sm:inline-flex">
                {t(`role.${user.role}`)}
              </Badge>
              <Button variant="ghost" size="icon" onClick={handleLogout} aria-label={t('auth.logout')}>
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {searchOpen && (
            <div className="px-4 pb-3 border-t border-border bg-muted/30">
              <div className="relative max-w-xl">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="search"
                  placeholder={t('common.searchPlaceholder')}
                  className="w-full pl-10 pr-10 py-2 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  autoFocus
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-accent"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-x-hidden">{children}</main>

        {/* Footer */}
        <footer className="mt-auto border-t border-border bg-card/50 py-4 px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Droplets className="w-3.5 h-3.5 text-primary" />
              <span>{t('app.name')} {t('app.version')} • {t('app.institution')}</span>
            </div>
            <div>{t('app.footer')}</div>
          </div>
        </footer>
      </div>
    </div>
  )
}
