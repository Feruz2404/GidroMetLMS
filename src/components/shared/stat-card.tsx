import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

const TONES = {
  blue: 'bg-primary/10 text-primary',
  cyan: 'bg-chart-2/15 text-chart-2',
  amber: 'bg-chart-3/15 text-[color:var(--chart-3)]',
  green: 'bg-success/12 text-success',
  violet: 'bg-chart-5/12 text-chart-5',
  rose: 'bg-destructive/10 text-destructive',
} as const

export type StatTone = keyof typeof TONES

interface StatCardProps {
  label: string
  value: React.ReactNode
  icon: LucideIcon
  tone?: StatTone
  hint?: React.ReactNode
  className?: string
}

export function StatCard({ label, value, icon: Icon, tone = 'blue', hint, className }: StatCardProps) {
  return (
    <div className={cn('rounded-xl border bg-card p-5 shadow-[var(--shadow-card)]', className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <p className="truncate text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
        </div>
        <span className={cn('flex size-10 shrink-0 items-center justify-center rounded-lg', TONES[tone])}>
          <Icon className="size-5" aria-hidden="true" />
        </span>
      </div>
      {hint && <div className="mt-3 text-xs text-muted-foreground">{hint}</div>}
    </div>
  )
}
