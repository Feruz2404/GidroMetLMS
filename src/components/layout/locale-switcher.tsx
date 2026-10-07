'use client'

import { Check, Languages } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { LOCALE_LABELS, LOCALES } from '@/i18n/config'
import { useI18n } from '@/i18n/provider'
import { cn } from '@/lib/utils'

export function LocaleSwitcher({ className, tone = 'default' }: { className?: string; tone?: 'default' | 'inverted' }) {
  const { locale, setLocale, t } = useI18n()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn('gap-1.5 font-semibold', tone === 'inverted' && 'text-white/80 hover:bg-white/10 hover:text-white', className)}
          aria-label={t('language.label')}
        >
          <Languages className="size-4" aria-hidden="true" />
          {LOCALE_LABELS[locale].short}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        {LOCALES.map((option) => (
          <DropdownMenuItem key={option} onSelect={() => setLocale(option)} className="justify-between">
            {LOCALE_LABELS[option].label}
            {option === locale && <Check className="size-4 text-primary" aria-hidden="true" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
