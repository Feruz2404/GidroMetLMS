'use client'

import type { TooltipProps } from 'recharts'
import type { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent'

export interface ChartSeries {
  key: string
  label: string
  /** A chart token, e.g. `var(--chart-1)`. */
  color: string
}

interface ChartTooltipContentProps extends TooltipProps<ValueType, NameType> {
  series: ChartSeries[]
  formatLabel: (label: string) => string
  formatValue: (value: number) => string
}

/** One readout for every series at the hovered position; the value leads, the series name follows. */
export function ChartTooltipContent({ active, payload, label, series, formatLabel, formatValue }: ChartTooltipContentProps) {
  if (!active || !payload?.length) return null
  const datum = payload[0].payload as Record<string, unknown>
  return (
    <div className="min-w-36 max-w-64 rounded-lg border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-[var(--shadow-elevated)]">
      <p className="mb-1.5 font-medium text-muted-foreground">{formatLabel(String(label ?? ''))}</p>
      <ul className="space-y-1">
        {series.map((item) => (
          <li key={item.key} className="flex items-center gap-2">
            <span aria-hidden="true" className="h-0.5 w-3 shrink-0 rounded-full" style={{ background: item.color }} />
            <span className="font-semibold tabular-nums text-foreground">{formatValue(Number(datum[item.key] ?? 0))}</span>
            <span className="truncate text-muted-foreground">{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Legend for charts with two or more series; keys mirror the mark (a short line). */
export function ChartLegend({ series }: { series: ChartSeries[] }) {
  return (
    <ul className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
      {series.map((item) => (
        <li key={item.key} className="inline-flex items-center gap-1.5">
          <span aria-hidden="true" className="h-0.5 w-3.5 rounded-full" style={{ background: item.color }} />
          {item.label}
        </li>
      ))}
    </ul>
  )
}
