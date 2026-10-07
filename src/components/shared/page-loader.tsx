import { Skeleton } from '@/components/ui/skeleton'

/** Skeleton for a standard page: header plus a grid of cards. */
export function PageSkeleton({ cards = 6 }: { cards?: number }) {
  return (
    <div className="space-y-6" aria-busy="true">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: cards }, (_, index) => (
          <Skeleton key={index} className="h-48 rounded-xl" />
        ))}
      </div>
    </div>
  )
}

export function CardGridSkeleton({ count = 6, className = 'h-72' }: { count?: number; className?: string }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3" aria-busy="true">
      {Array.from({ length: count }, (_, index) => (
        <Skeleton key={index} className={`${className} rounded-xl`} />
      ))}
    </div>
  )
}
