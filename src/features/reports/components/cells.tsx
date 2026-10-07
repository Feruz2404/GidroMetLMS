'use client'

import { useI18n } from '@/i18n/provider'

/** Primary text with a muted second line (e.g. name + email). */
export function TwoLineCell({ primary, secondary }: { primary: React.ReactNode; secondary?: React.ReactNode }) {
  return (
    <div className="min-w-36 max-w-44 sm:max-w-60">
      <div className="truncate font-medium">{primary}</div>
      {secondary && <div className="truncate text-xs text-muted-foreground">{secondary}</div>}
    </div>
  )
}

/** A percentage, or a dash when there is nothing to average yet. */
export function PercentCell({ value }: { value: number | null }) {
  const { t } = useI18n()
  if (value === null) return <span className="text-muted-foreground">{t('common.none')}</span>
  return <span className="tabular-nums">{t('common.percent', { value })}</span>
}

/** Integer counts with locale grouping; zero is de-emphasised. */
export function CountCell({ value }: { value: number }) {
  const { formatNumber } = useI18n()
  return <span className={value === 0 ? 'text-muted-foreground' : undefined}>{formatNumber(value)}</span>
}

/** "part / total" figure (e.g. completed of enrolled) with a spelled-out label for screen readers. */
export function Ratio({ part, total, label }: { part: number; total: number; label: string }) {
  const { formatNumber } = useI18n()
  return (
    <span className="whitespace-nowrap tabular-nums" title={label}>
      <span aria-hidden="true">
        <span className={part === 0 ? 'text-muted-foreground' : undefined}>{formatNumber(part)}</span>
        <span className="text-muted-foreground"> / {formatNumber(total)}</span>
      </span>
      <span className="sr-only">{label}</span>
    </span>
  )
}
