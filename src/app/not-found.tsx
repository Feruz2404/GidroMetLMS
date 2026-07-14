import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <section className="max-w-md text-center">
        <p className="text-sm font-semibold text-cyan-700">404</p>
        <h1 className="mt-2 text-2xl font-semibold">Sahifa topilmadi</h1>
        <p className="mt-2 text-sm text-slate-600">Manzilni tekshiring yoki bosh sahifaga qayting.</p>
        <Button asChild className="mt-5"><Link href="/">Bosh sahifa</Link></Button>
      </section>
    </main>
  )
}
