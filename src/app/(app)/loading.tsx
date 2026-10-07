import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <main className="mx-auto min-h-screen max-w-7xl space-y-5 p-5 sm:p-8" aria-busy="true" aria-label="Yuklanmoqda">
      <Skeleton className="h-12 w-56" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => <Skeleton key={index} className="h-32" />)}
      </div>
    </main>
  )
}
