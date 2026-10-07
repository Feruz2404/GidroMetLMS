// Pure helpers for bucketing timestamps into chart series.
import type { DailyPointDto } from '@/shared/dto'

const DAY_MS = 24 * 60 * 60 * 1000

export function dayKey(date: Date): string {
  return date.toISOString().slice(0, 10)
}

export function monthKey(date: Date): string {
  return date.toISOString().slice(0, 7)
}

export function lastDays(count: number, now = new Date()): string[] {
  return Array.from({ length: count }, (_, index) => dayKey(new Date(now.getTime() - (count - 1 - index) * DAY_MS)))
}

export function lastMonths(count: number, now = new Date()): string[] {
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (count - 1 - index), 1))
    return monthKey(date)
  })
}

export function daysAgo(days: number, now = new Date()): Date {
  return new Date(now.getTime() - days * DAY_MS)
}

/** Counts dates per day; with `distinctBy`, counts distinct keys (e.g. users) per day. */
export function dailySeries(
  days: string[],
  items: Array<{ at: Date | null; key?: string }>,
  distinct = false
): DailyPointDto[] {
  const buckets = new Map(days.map((day) => [day, new Set<string>()]))
  const counts = new Map(days.map((day) => [day, 0]))
  for (const item of items) {
    if (!item.at) continue
    const day = dayKey(item.at)
    if (!counts.has(day)) continue
    if (distinct && item.key) buckets.get(day)!.add(item.key)
    else counts.set(day, counts.get(day)! + 1)
  }
  return days.map((day) => ({ date: day, value: distinct ? buckets.get(day)!.size : counts.get(day)! }))
}

export function rate(part: number, whole: number): number {
  return whole > 0 ? Math.round((part / whole) * 100) : 0
}

export function average(values: number[]): number {
  return values.length ? Math.round(values.reduce((total, value) => total + value, 0) / values.length) : 0
}
