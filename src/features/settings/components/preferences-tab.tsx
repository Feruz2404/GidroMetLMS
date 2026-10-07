'use client'

import { useSyncExternalStore } from 'react'
import { Monitor, Moon, Sun, type LucideIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { SectionCard } from '@/components/shared/section-card'
import type { MessageKey } from '@/i18n'
import { isLocale, LOCALE_LABELS, LOCALES } from '@/i18n/config'
import { useI18n } from '@/i18n/provider'
import { cn } from '@/lib/utils'
import { ChoiceCard, ChoiceGroup } from './choice-card'

const THEMES: Array<{ value: 'light' | 'dark' | 'system'; icon: LucideIcon; label: MessageKey; hint: MessageKey }> = [
  { value: 'light', icon: Sun, label: 'theme.light', hint: 'settings.theme.lightHint' },
  { value: 'dark', icon: Moon, label: 'theme.dark', hint: 'settings.theme.darkHint' },
  { value: 'system', icon: Monitor, label: 'theme.system', hint: 'settings.theme.systemHint' },
]

const subscribe = () => () => {}

/** The stored theme is only known in the browser; render no selection during SSR to avoid a hydration mismatch. */
function useMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  )
}

export function PreferencesTab() {
  const { t, locale, setLocale } = useI18n()
  const { theme, setTheme } = useTheme()
  const mounted = useMounted()

  return (
    <div className="space-y-6">
      <SectionCard title={t('settings.preferences.language')} description={t('settings.preferences.languageHint')}>
        <ChoiceGroup value={locale} onValueChange={(next) => isLocale(next) && setLocale(next)} label={t('settings.preferences.language')}>
          {LOCALES.map((code) => (
            <ChoiceCard key={code} value={code} className="flex-row items-center sm:flex-col sm:items-stretch">
              <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold tracking-wide text-primary">
                {LOCALE_LABELS[code].short}
              </span>
              <span className="block space-y-0.5 pr-6">
                <span className="block font-medium" lang={code}>
                  {LOCALE_LABELS[code].label}
                </span>
                <span className="block text-xs text-muted-foreground">{t(`settings.locale.${code}`)}</span>
              </span>
            </ChoiceCard>
          ))}
        </ChoiceGroup>
      </SectionCard>

      <SectionCard title={t('settings.preferences.theme')} description={t('settings.preferences.themeHint')}>
        <ChoiceGroup value={mounted ? theme : undefined} onValueChange={setTheme} label={t('settings.preferences.theme')}>
          {THEMES.map((option) => (
            <ChoiceCard key={option.value} value={option.value}>
              <span className="flex items-start gap-2.5 pr-6">
                <option.icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <span className="block space-y-0.5">
                  <span className="block font-medium">{t(option.label)}</span>
                  <span className="block text-xs text-muted-foreground">{t(option.hint)}</span>
                </span>
              </span>
              <ThemePreview mode={option.value} />
            </ChoiceCard>
          ))}
        </ChoiceGroup>
      </SectionCard>
    </div>
  )
}

// The previews depict a specific theme whatever theme is active, so they use
// fixed palette colours rather than the theme tokens.
function MiniWindow({ dark, className }: { dark: boolean; className?: string }) {
  return (
    <span className={cn('flex h-full w-full overflow-hidden', dark ? 'bg-slate-900' : 'bg-slate-50', className)}>
      <span className="flex w-1/4 flex-col gap-1 bg-[#101c33] p-1.5">
        <span className="h-1.5 w-3/4 rounded-full bg-sky-400/80" />
        <span className="h-1 w-full rounded-full bg-white/20" />
        <span className="h-1 w-2/3 rounded-full bg-white/20" />
      </span>
      <span className="flex flex-1 flex-col gap-1.5 p-2">
        <span className={cn('h-1.5 w-1/2 rounded-full', dark ? 'bg-slate-500' : 'bg-slate-300')} />
        <span className="h-1.5 w-1/4 rounded-full bg-blue-500" />
        <span className="mt-auto grid grid-cols-2 gap-1.5">
          <span className={cn('h-6 rounded', dark ? 'bg-slate-800' : 'bg-white shadow-sm ring-1 ring-slate-200')} />
          <span className={cn('h-6 rounded', dark ? 'bg-slate-800' : 'bg-white shadow-sm ring-1 ring-slate-200')} />
        </span>
      </span>
    </span>
  )
}

function ThemePreview({ mode }: { mode: 'light' | 'dark' | 'system' }) {
  return (
    <span className="relative block h-24 overflow-hidden rounded-lg border" aria-hidden="true">
      {mode === 'system' ? (
        <>
          <MiniWindow dark={false} />
          <MiniWindow dark className="absolute inset-0 [clip-path:polygon(60%_0,100%_0,100%_100%,40%_100%)]" />
        </>
      ) : (
        <MiniWindow dark={mode === 'dark'} />
      )}
    </span>
  )
}
