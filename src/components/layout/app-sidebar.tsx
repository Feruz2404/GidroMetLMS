'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { Logo, LogoMark } from '@/components/brand/logo'
import { UserAvatar } from '@/components/shared/user-avatar'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useSession } from '@/features/auth/session'
import type { MessageKey } from '@/i18n'
import { useI18n } from '@/i18n/provider'
import { cn } from '@/lib/utils'
import { isActivePath, NAV_GROUPS } from './nav-config'

interface AppSidebarProps {
  collapsed?: boolean
  onToggle?: () => void
  onNavigate?: () => void
}

export function AppSidebar({ collapsed = false, onToggle, onNavigate }: AppSidebarProps) {
  const pathname = usePathname()
  const { user } = useSession()
  const { t } = useI18n()

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className={cn('flex h-16 shrink-0 items-center border-b border-sidebar-border', collapsed ? 'justify-center px-2' : 'justify-between px-5')}>
        <Link href="/dashboard" onClick={onNavigate} className="min-w-0 rounded-lg focus-visible:outline-2 focus-visible:outline-sidebar-ring">
          {collapsed ? <LogoMark /> : <Logo inverted subtitle={t('app.institution')} />}
        </Link>
        {onToggle && !collapsed && (
          <button
            type="button"
            onClick={onToggle}
            className="rounded-md p-1.5 text-sidebar-muted transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
            aria-label={t('nav.collapse')}
          >
            <PanelLeftClose className="size-4" />
          </button>
        )}
      </div>

      <nav className="scrollbar-thin flex-1 space-y-6 overflow-y-auto px-3 py-5" aria-label="Main">
        {NAV_GROUPS.map((group) => {
          const items = group.items.filter((item) => item.visible(user.role))
          if (!items.length) return null
          return (
            <div key={group.label} className="space-y-1">
              {!collapsed && (
                <p className="px-3 pb-1 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-sidebar-muted">{t(group.label)}</p>
              )}
              {items.map((item) => (
                <SidebarLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  icon={item.icon}
                  active={isActivePath(pathname, item.href)}
                  collapsed={collapsed}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          )
        })}
      </nav>

      <div className="shrink-0 border-t border-sidebar-border p-3">
        {onToggle && collapsed && (
          <button
            type="button"
            onClick={onToggle}
            className="mb-2 flex w-full items-center justify-center rounded-lg p-2 text-sidebar-muted transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
            aria-label={t('nav.expand')}
          >
            <PanelLeftOpen className="size-4" />
          </button>
        )}
        <Link
          href="/settings"
          onClick={onNavigate}
          className={cn('flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-sidebar-accent', collapsed && 'justify-center')}
        >
          <UserAvatar user={user} className="size-9 ring-2 ring-sidebar-border" />
          {!collapsed && (
            <div className="min-w-0 leading-tight">
              <p className="truncate text-sm font-medium">{user.firstName} {user.lastName}</p>
              <p className="truncate text-xs text-sidebar-muted">{t(`role.${user.role}` as MessageKey)}</p>
            </div>
          )}
        </Link>
      </div>
    </div>
  )
}

function SidebarLink({
  href,
  label,
  icon: Icon,
  active,
  collapsed,
  onNavigate,
}: {
  href: string
  label: MessageKey
  icon: (typeof NAV_GROUPS)[number]['items'][number]['icon']
  active: boolean
  collapsed: boolean
  onNavigate?: () => void
}) {
  const { t } = useI18n()
  const link = (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
        collapsed && 'justify-center px-0',
        active
          ? 'bg-sidebar-accent text-sidebar-accent-foreground'
          : 'text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground'
      )}
    >
      {active && <span className="absolute inset-y-2 left-0 w-[3px] rounded-r-full bg-sidebar-primary" aria-hidden="true" />}
      <Icon className={cn('size-[18px] shrink-0', active ? 'text-sidebar-primary' : 'text-sidebar-muted group-hover:text-sidebar-foreground')} aria-hidden="true" />
      {!collapsed && <span className="truncate">{t(label)}</span>}
    </Link>
  )
  if (!collapsed) return link
  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right">{t(label)}</TooltipContent>
    </Tooltip>
  )
}
