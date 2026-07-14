'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('Application route failed', { digest: error.digest })
  }, [error.digest])

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <section className="max-w-md rounded-xl border bg-white p-7 text-center shadow-sm" role="alert">
        <h1 className="text-xl font-semibold">Sahifani yuklab bo‘lmadi</h1>
        <p className="mt-2 text-sm text-slate-600">Vaqtincha xatolik yuz berdi. Qayta urinib ko‘ring.</p>
        <Button className="mt-5" onClick={reset}>Qayta urinish</Button>
      </section>
    </main>
  )
}
