'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { useIsClient } from '@/hooks/use-is-client'
import { useI18n } from '@/i18n/provider'
import { cn } from '@/lib/utils'

export function ThemeToggle({ className, tone = 'default' }: { className?: string; tone?: 'default' | 'inverted' }) {
  const { resolvedTheme, setTheme } = useTheme()
  const { t } = useI18n()
  // The resolved theme is only known in the browser.
  const dark = useIsClient() && resolvedTheme === 'dark'

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(dark ? 'light' : 'dark')}
      className={cn(tone === 'inverted' && 'text-white/80 hover:bg-white/10 hover:text-white', className)}
      aria-label={dark ? t('theme.light') : t('theme.dark')}
    >
      {dark ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
    </Button>
  )
}
