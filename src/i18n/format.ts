// Locale-aware formatting. Browsers ship incomplete CLDR data for Uzbek
// (Chromium renders "2026 M10 7"), so Uzbek dates are composed from our own
// month names and Uzbek numbers reuse the Russian grouping (1 234,5), which
// matches Uzbek typographic convention.
import { INTL_LOCALE, type Locale } from './config'

export type DateStyle = 'short' | 'medium' | 'long' | 'datetime' | 'monthYear' | 'dayMonth' | 'month'

const UZ_MONTHS = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr']
const UZ_MONTHS_SHORT = ['yan', 'fev', 'mar', 'apr', 'may', 'iyn', 'iyl', 'avg', 'sen', 'okt', 'noy', 'dek']

const INTL_STYLES: Record<DateStyle, Intl.DateTimeFormatOptions> = {
  short: { day: '2-digit', month: '2-digit', year: 'numeric' },
  medium: { day: 'numeric', month: 'short', year: 'numeric' },
  long: { day: 'numeric', month: 'long', year: 'numeric' },
  datetime: { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' },
  monthYear: { month: 'long', year: 'numeric' },
  dayMonth: { day: 'numeric', month: 'short' },
  month: { month: 'short' },
}

const pad = (value: number) => String(value).padStart(2, '0')

function formatUzbekDate(date: Date, style: DateStyle): string {
  const day = date.getDate()
  const month = date.getMonth()
  const year = date.getFullYear()
  switch (style) {
    case 'short':
      return `${pad(day)}.${pad(month + 1)}.${year}`
    case 'medium':
      return `${day}-${UZ_MONTHS_SHORT[month]}, ${year}`
    case 'long':
      return `${year}-yil ${day}-${UZ_MONTHS[month]}`
    case 'datetime':
      return `${pad(day)}.${pad(month + 1)}.${year} ${pad(date.getHours())}:${pad(date.getMinutes())}`
    case 'monthYear':
      return `${year}-yil ${UZ_MONTHS[month]}`
    case 'dayMonth':
      return `${day}-${UZ_MONTHS_SHORT[month]}`
    case 'month':
      return UZ_MONTHS_SHORT[month]
  }
}

export function formatDateValue(locale: Locale, input: string | Date | null | undefined, style: DateStyle = 'medium'): string {
  if (!input) return '—'
  const date = typeof input === 'string' ? new Date(input) : input
  if (Number.isNaN(date.getTime())) return '—'
  if (locale === 'uz') return formatUzbekDate(date, style)
  return new Intl.DateTimeFormat(INTL_LOCALE[locale], INTL_STYLES[style]).format(date)
}

export function formatNumberValue(locale: Locale, value: number, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat(locale === 'uz' ? 'ru-RU' : INTL_LOCALE[locale], options).format(value)
}
