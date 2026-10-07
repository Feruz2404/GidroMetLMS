'use client'

import { useEffect } from 'react'
import { AlertTriangle, RotateCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/i18n/provider'

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { t } = useI18n()
  useEffect(() => {
    console.error('Route render failed', { digest: error.digest })
  }, [error.digest])

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <section className="max-w-md text-center" role="alert">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertTriangle className="size-7" aria-hidden="true" />
        </span>
        <h1 className="mt-6 text-xl font-semibold">{t('errorPage.title')}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t('errorPage.description')}</p>
        <Button className="mt-6" onClick={reset}>
          <RotateCw aria-hidden="true" />
          {t('action.retry')}
        </Button>
      </section>
    </div>
  )
}
