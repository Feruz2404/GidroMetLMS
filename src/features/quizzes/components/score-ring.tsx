import { cn } from '@/lib/utils'

export type ScoreTone = 'success' | 'warning' | 'destructive' | 'muted'

const STROKES: Record<ScoreTone, string> = {
  success: 'stroke-success',
  warning: 'stroke-warning',
  destructive: 'stroke-destructive',
  muted: 'stroke-muted-foreground/40',
}

/** Green at or above the passing score, amber when close to it, red otherwise. */
export function scoreTone(percentage: number | null, passingScore: number): ScoreTone {
  if (percentage === null) return 'muted'
  if (percentage >= passingScore) return 'success'
  if (percentage >= passingScore - 20) return 'warning'
  return 'destructive'
}

interface ScoreRingProps {
  value: number | null
  tone: ScoreTone
  size?: number
  strokeWidth?: number
  /** Draws the arc in from zero once, for celebratory placements. */
  animate?: boolean
  label: string
  className?: string
  children?: React.ReactNode
}

/** Circular percentage gauge; the centre shows `children` (defaults to the value). */
export function ScoreRing({ value, tone, size = 56, strokeWidth = 5, animate = false, label, className, children }: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const clamped = Math.max(0, Math.min(100, Math.round(value ?? 0)))
  const offset = circumference * (1 - clamped / 100)

  return (
    <div className={cn('relative inline-flex shrink-0 items-center justify-center', className)} style={{ width: size, height: size }} role="img" aria-label={label}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth={strokeWidth} className="stroke-muted" />
        {value !== null && clamped > 0 && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={STROKES[tone]}
          >
            {animate && (
              <animate
                attributeName="stroke-dashoffset"
                from={circumference}
                to={offset}
                dur="1.1s"
                calcMode="spline"
                keyTimes="0;1"
                keySplines="0.22 1 0.36 1"
                fill="freeze"
              />
            )}
          </circle>
        )}
      </svg>
      <span className="absolute inset-0 flex flex-col items-center justify-center text-center" aria-hidden="true">
        {children ?? <span className="text-sm font-semibold tabular-nums">{value === null ? '—' : `${clamped}%`}</span>}
      </span>
    </div>
  )
}
