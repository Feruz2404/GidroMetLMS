import Link from 'next/link'
import { Compass } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getServerTranslator } from '@/i18n/server'

export default async function NotFound() {
  const t = await getServerTranslator()
  return (
    <main className="flex min-h-dvh items-center justify-center bg-background p-6">
      <section className="max-w-md text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Compass className="size-7" aria-hidden="true" />
        </span>
        <p className="mt-6 text-sm font-semibold text-primary">404</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">{t('notFound.title')}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t('notFound.description')}</p>
        <Button asChild className="mt-6">
          <Link href="/">{t('notFound.home')}</Link>
        </Button>
      </section>
    </main>
  )
}
