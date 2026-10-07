import { cn } from '@/lib/utils'

interface SectionCardProps {
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
  contentClassName?: string
}

/** Card with an optional titled header; the standard container for page sections. */
export function SectionCard({ title, description, action, children, className, contentClassName }: SectionCardProps) {
  return (
    <section className={cn('rounded-xl border bg-card shadow-[var(--shadow-card)]', className)}>
      {(title || action) && (
        <div className="flex items-start justify-between gap-3 border-b px-5 py-4">
          <div className="min-w-0">
            {title && <h2 className="font-semibold tracking-tight">{title}</h2>}
            {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className={cn('p-5', contentClassName)}>{children}</div>
    </section>
  )
}
