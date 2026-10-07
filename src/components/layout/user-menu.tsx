'use client'

import Link from 'next/link'
import { LogOut, Monitor, Moon, Settings, Sun, UserRound } from 'lucide-react'
import { useTheme } from 'next-themes'
import { UserAvatar } from '@/components/shared/user-avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useSession } from '@/features/auth/session'
import type { MessageKey } from '@/i18n'
import { LOCALE_LABELS, LOCALES, type Locale } from '@/i18n/config'
import { useI18n } from '@/i18n/provider'
import { routes } from '@/lib/routes'

export function UserMenu() {
  const { user, signOut } = useSession()
  const { t, locale, setLocale } = useI18n()
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full outline-none ring-offset-2 ring-offset-background focus-visible:ring-2 focus-visible:ring-ring" aria-label={t('nav.profile')}>
        <UserAvatar user={user} className="size-9" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="font-normal">
          <p className="truncate font-semibold">{user.lastName} {user.firstName}</p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          <p className="mt-1 text-xs font-medium text-primary">{t(`role.${user.role}` as MessageKey)}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={routes.settings('profile')}>
            <UserRound aria-hidden="true" />
            {t('nav.profile')}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={routes.settings()}>
            <Settings aria-hidden="true" />
            {t('nav.settings')}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Sun aria-hidden="true" className="mr-2 size-4 text-muted-foreground" />
            {t('theme.label')}
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
              <DropdownMenuRadioItem value="light"><Sun aria-hidden="true" className="mr-2 size-4" />{t('theme.light')}</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="dark"><Moon aria-hidden="true" className="mr-2 size-4" />{t('theme.dark')}</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="system"><Monitor aria-hidden="true" className="mr-2 size-4" />{t('theme.system')}</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <span className="mr-2 w-4 text-center text-[0.65rem] font-bold text-muted-foreground">{LOCALE_LABELS[locale].short}</span>
            {t('language.label')}
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={locale} onValueChange={(value) => setLocale(value as Locale)}>
              {LOCALES.map((option) => (
                <DropdownMenuRadioItem key={option} value={option}>{LOCALE_LABELS[option].label}</DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => void signOut()} className="text-destructive focus:text-destructive">
          <LogOut aria-hidden="true" />
          {t('nav.signOut')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
