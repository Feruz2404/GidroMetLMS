'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { LOCALE_COOKIE, type Locale } from './config'
import { formatDateValue, formatNumberValue, type DateStyle } from './format'
import { translate, type MessageKey, type TranslateParams } from './index'

export type Translate = (key: MessageKey, params?: TranslateParams) => string

interface I18nContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: Translate
  formatDate: (value: string | Date | null | undefined, style?: DateStyle) => string
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string
  formatRelative: (value: string | Date) => string
  formatDuration: (seconds: number) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({ initialLocale, children }: { initialLocale: Locale; children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale)

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  const setLocale = useCallback((next: Locale) => {
    // A cookie (not localStorage) so the server renders the same language on the next request.
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`
    setLocaleState(next)
  }, [])

  const value = useMemo<I18nContextValue>(() => {
    const t: Translate = (key, params) => translate(locale, key, params)
    return {
      locale,
      setLocale,
      t,
      formatDate: (input, style = 'medium') => formatDateValue(locale, input, style),
      formatNumber: (input, options) => formatNumberValue(locale, input, options),
      formatRelative: (input) => {
        const date = typeof input === 'string' ? new Date(input) : input
        const minutes = Math.round((Date.now() - date.getTime()) / 60_000)
        if (minutes < 1) return t('time.justNow')
        if (minutes < 60) return t('time.minutesAgo', { count: minutes })
        const hours = Math.round(minutes / 60)
        if (hours < 24) return t('time.hoursAgo', { count: hours })
        const days = Math.round(hours / 24)
        if (days < 7) return t('time.daysAgo', { count: days })
        return formatDateValue(locale, date, 'medium')
      },
      formatDuration: (seconds) => {
        const total = Math.max(0, Math.round(seconds))
        const minutes = Math.floor(total / 60)
        const rest = total % 60
        return `${minutes}:${String(rest).padStart(2, '0')}`
      },
    }
  }, [locale, setLocale])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext)
  if (!context) throw new Error('useI18n must be used inside <I18nProvider>')
  return context
}
