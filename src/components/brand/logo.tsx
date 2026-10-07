import { cn } from '@/lib/utils'

/** Brand mark: a water drop over a wind/wave line — weather, water and climate. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={cn('size-9', className)} aria-hidden="true">
      <defs>
        <linearGradient id="gidroedu-mark" x1="6" y1="4" x2="34" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#38bdf8" />
          <stop offset="1" stopColor="#2563eb" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11" fill="url(#gidroedu-mark)" />
      <path d="M20 7.5c-4.6 5.5-8 10-8 14.2a8 8 0 0 0 16 0c0-4.2-3.4-8.7-8-14.2Z" fill="#fff" fillOpacity="0.95" />
      <path d="M13.5 23.5c2.2 1.6 4.3 1.6 6.5 0s4.3-1.6 6.5 0" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" fill="none" />
    </svg>
  )
}

export function Logo({ className, subtitle, inverted = false }: { className?: string; subtitle?: string; inverted?: boolean }) {
  return (
    <div className={cn('flex min-w-0 items-center gap-3', className)}>
      <LogoMark className="shrink-0" />
      <div className="min-w-0 leading-tight">
        <p className={cn('truncate text-[1.05rem] font-semibold tracking-tight', inverted ? 'text-white' : 'text-foreground')}>
          Gidro<span className={inverted ? 'text-sky-300' : 'text-primary'}>Edu</span>
        </p>
        {subtitle && <p className={cn('truncate text-xs', inverted ? 'text-white/60' : 'text-muted-foreground')}>{subtitle}</p>}
      </div>
    </div>
  )
}
