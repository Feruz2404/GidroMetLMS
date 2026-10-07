'use client'

import Link from 'next/link'
import { LayoutDashboard, LogIn } from 'lucide-react'
import { Logo } from '@/components/brand/logo'
import { LocaleSwitcher } from '@/components/layout/locale-switcher'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/i18n/provider'
import { routes } from '@/lib/routes'

/** Minimal chrome for public pages (certificate verification): works signed out. */
export function PublicShell({ signedIn, children }: { signedIn: boolean; children: React.ReactNode }) {
  const { t } = useI18n()
  return (
    <div className="flex min-h-dvh flex-col bg-background bg-[radial-gradient(ellipse_at_top,color-mix(in_oklch,var(--primary)_12%,transparent),transparent_70%)] bg-[length:100%_22rem] bg-no-repeat">
      <header className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70 print:hidden">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link href={routes.home} className="min-w-0 rounded-lg focus-visible:outline-2 focus-visible:outline-ring">
            <Logo subtitle={t('app.institution')} className="[&_p:last-child]:hidden sm:[&_p:last-child]:block" />
          </Link>
          <div className="flex shrink-0 items-center gap-1">
            <LocaleSwitcher />
            <ThemeToggle />
            <Button asChild size="sm" variant={signedIn ? 'outline' : 'default'} className="ml-1">
              {signedIn ? (
                <Link href={routes.dashboard}>
                  <LayoutDashboard aria-hidden="true" />
                  <span className="sr-only sm:not-sr-only">{t('certificates.public.dashboard')}</span>
                </Link>
              ) : (
                <Link href={routes.login()}>
                  <LogIn aria-hidden="true" />
                  {t('certificates.public.signIn')}
                </Link>
              )}
            </Button>
          </div>
        </div>
      </header>

      <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:py-12">
        {children}
      </main>

      <footer className="border-t py-5 text-xs text-muted-foreground print:hidden">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 sm:flex-row sm:justify-between sm:px-6">
          <span>{t('app.copyright', { year: new Date().getFullYear() })}</span>
          <span>{t('app.institution')}</span>
        </div>
      </footer>
    </div>
  )
}
