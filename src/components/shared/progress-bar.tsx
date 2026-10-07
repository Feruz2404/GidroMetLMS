import { cn } from '@/lib/utils'

/** Slim labelled progress bar; colour turns green at 100 %. */
export function ProgressBar({ value, className, showLabel = false, size = 'md' }: { value: number; className?: string; showLabel?: boolean; size?: 'sm' | 'md' }) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)))
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div
        className={cn('relative w-full overflow-hidden rounded-full bg-muted', size === 'sm' ? 'h-1.5' : 'h-2')}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={clamped}
      >
        <div
          className={cn('h-full rounded-full transition-[width] duration-500', clamped >= 100 ? 'bg-success' : 'bg-primary')}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && <span className="w-10 shrink-0 text-right text-xs font-medium tabular-nums text-muted-foreground">{clamped}%</span>}
    </div>
  )
}
