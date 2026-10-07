import Link from 'next/link'
import { ArrowRight, type LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const TONES = {
  blue: 'bg-primary/10 text-primary',
  green: 'bg-success/12 text-success',
  red: 'bg-destructive/10 text-destructive',
  amber: 'bg-warning/18 text-warning-foreground dark:text-warning',
  violet: 'bg-chart-5/12 text-chart-5',
} as const

export function IconTile({ icon: Icon, tone = 'blue' }: { icon: LucideIcon; tone?: keyof typeof TONES }) {
  return (
    <span className={cn('flex size-9 shrink-0 items-center justify-center rounded-lg', TONES[tone])}>
      <Icon className="size-4" aria-hidden="true" />
    </span>
  )
}

interface LinkRowProps {
  href: string
  leading?: React.ReactNode
  title: React.ReactNode
  meta?: React.ReactNode
  trailing?: React.ReactNode
}

/** A clickable row in a dashboard list: icon, title + meta line, trailing figure. */
export function LinkRow({ href, leading, title, meta, trailing }: LinkRowProps) {
  return (
    <li>
      <Link
        href={href}
        className="group -mx-2 flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        {leading}
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 break-words text-sm font-medium group-hover:text-primary">{title}</p>
          {meta && <p className="truncate text-xs text-muted-foreground">{meta}</p>}
        </div>
        {trailing && <div className="flex shrink-0 items-center gap-2">{trailing}</div>}
      </Link>
    </li>
  )
}

/** "See all" link for a section card header. */
export function SeeAllLink({ href, label }: { href: string; label: string }) {
  return (
    <Button asChild variant="ghost" size="sm" className="text-primary hover:text-primary">
      <Link href={href}>
        {label}
        <ArrowRight aria-hidden="true" />
      </Link>
    </Button>
  )
}

/** Short muted line used when a small list has nothing to show. */
export function ListEmpty({ icon: Icon, children }: { icon: LucideIcon; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2 py-6 text-center text-sm text-muted-foreground">
      <Icon className="size-5" aria-hidden="true" />
      <p className="max-w-xs">{children}</p>
    </div>
  )
}
