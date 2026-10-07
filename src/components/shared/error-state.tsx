'use client'

import { AlertTriangle, RotateCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/i18n/provider'
import { useErrorMessage } from '@/lib/use-api-error'
import { cn } from '@/lib/utils'

export function ErrorState({ error, onRetry, className }: { error?: unknown; onRetry?: () => void; className?: string }) {
  const { t } = useI18n()
  const message = useErrorMessage()
  return (
    <div role="alert" className={cn('flex flex-col items-center gap-3 rounded-xl border border-destructive/25 bg-destructive/5 px-6 py-12 text-center', className)}>
      <span className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="size-6" aria-hidden="true" />
      </span>
      <div className="space-y-1">
        <p className="font-medium">{t('state.error')}</p>
        <p className="text-sm text-muted-foreground">{error ? message(error) : t('state.errorHint')}</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RotateCw aria-hidden="true" />
          {t('action.retry')}
        </Button>
      )}
    </div>
  )
}
