import { cn } from '@/lib/utils'

export interface Metric {
  label: string
  value: React.ReactNode
  hint?: React.ReactNode
}

/** Compact row of secondary figures under the main KPI cards (4 or 6 items). */
export function MetricStrip({ items, className }: { items: Metric[]; className?: string }) {
  return (
    <dl
      className={cn(
        'grid gap-px overflow-hidden rounded-xl border bg-border shadow-[var(--shadow-card)]',
        items.length > 4 ? 'grid-cols-2 sm:grid-cols-3 xl:grid-cols-6' : 'grid-cols-2 lg:grid-cols-4',
        className
      )}
    >
      {items.map((item) => (
        <div key={item.label} className="min-w-0 bg-card px-4 py-3.5">
          <dt className="truncate text-xs font-medium text-muted-foreground">{item.label}</dt>
          <dd className="mt-1 text-lg font-semibold tracking-tight">{item.value}</dd>
          {item.hint && <dd className="truncate text-xs text-muted-foreground">{item.hint}</dd>}
        </div>
      ))}
    </dl>
  )
}
