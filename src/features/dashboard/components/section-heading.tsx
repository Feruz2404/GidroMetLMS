/** Heading for an unframed dashboard section (e.g. a grid of course cards). */
export function SectionHeading({ id, title, description, action }: { id: string; title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-x-3 gap-y-1">
      <div className="min-w-0">
        <h2 id={id} className="text-lg font-semibold tracking-tight">
          {title}
        </h2>
        {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
