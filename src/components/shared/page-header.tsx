import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: React.ReactNode
  description?: React.ReactNode
  /** Right-aligned actions (buttons). */
  actions?: React.ReactNode
  /** Optional back link rendered above the title. */
  back?: { href: string; label: string }
  /** Small label above the title (e.g. a category). */
  eyebrow?: React.ReactNode
  className?: string
}

export function PageHeader({ title, description, actions, back, eyebrow, className }: PageHeaderProps) {
  return (
    <header className={cn('mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between', className)}>
      <div className="min-w-0 space-y-1.5">
        {back && (
          <Link
            href={back.href}
            className="mb-1 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
            {back.label}
          </Link>
        )}
        {eyebrow && <div className="text-xs font-semibold uppercase tracking-wider text-primary">{eyebrow}</div>}
        <h1 className="text-2xl font-semibold tracking-tight text-balance sm:text-[1.7rem]">{title}</h1>
        {description && <p className="max-w-3xl text-sm text-muted-foreground sm:text-[0.95rem]">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </header>
  )
}
