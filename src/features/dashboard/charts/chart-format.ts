'use client'

import { useMemo } from 'react'
import { useI18n } from '@/i18n/provider'

/**
 * Parses a "YYYY-MM-DD" or "YYYY-MM" bucket key as a local date, so axis
 * labels never shift by a day in time zones west of UTC.
 */
export function parseBucket(key: string): Date {
  const [year, month = 1, day = 1] = key.split('-').map(Number)
  return new Date(year, month - 1, day)
}

/** Locale-aware formatters for chart axes and tooltips (built on the shared date formatter). */
export function useChartFormat() {
  const { formatDate, formatNumber } = useI18n()
  return useMemo(
    () => ({
      number: (value: number) => formatNumber(value),
      dayTick: (key: string) => formatDate(parseBucket(key), 'dayMonth'),
      dayLabel: (key: string) => formatDate(parseBucket(key), 'long'),
      // There is no month-only style; "1 Oct" / "1 окт." / "1-okt" minus the leading day number.
      monthTick: (key: string) => formatDate(parseBucket(key), 'month'),
      monthLabel: (key: string) => formatDate(parseBucket(key), 'monthYear'),
    }),
    [formatDate, formatNumber]
  )
}
