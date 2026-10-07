export const LOCALES = ['uz', 'ru', 'en'] as const
export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'uz'
export const LOCALE_COOKIE = 'gidroedu_lang'

/** BCP 47 tags used for Intl date/number formatting. */
export const INTL_LOCALE: Record<Locale, string> = {
  uz: 'uz-Latn-UZ',
  ru: 'ru-RU',
  en: 'en-GB',
}

export const LOCALE_LABELS: Record<Locale, { label: string; short: string }> = {
  uz: { label: 'O‘zbekcha', short: 'UZ' },
  ru: { label: 'Русский', short: 'RU' },
  en: { label: 'English', short: 'EN' },
}

export function isLocale(value: string | null | undefined): value is Locale {
  return LOCALES.includes(value as Locale)
}
