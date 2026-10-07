import { cn } from '@/lib/utils'
import { scoreTone } from './score-ring'

const BAR: Record<ReturnType<typeof scoreTone>, string> = {
  success: 'bg-success',
  warning: 'bg-warning',
  destructive: 'bg-destructive',
  muted: 'bg-muted-foreground/40',
}

/** Percentage with a short bar coloured against the passing score; for table cells. */
export function ScorePill({ percentage, passingScore, className }: { percentage: number; passingScore: number; className?: string }) {
  const clamped = Math.max(0, Math.min(100, Math.round(percentage)))
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <span className="w-9 text-right text-sm font-semibold tabular-nums">{clamped}%</span>
      <span className="hidden h-1.5 w-16 overflow-hidden rounded-full bg-muted sm:block" aria-hidden="true">
        <span className={cn('block h-full rounded-full', BAR[scoreTone(clamped, passingScore)])} style={{ width: `${clamped}%` }} />
      </span>
    </span>
  )
}
