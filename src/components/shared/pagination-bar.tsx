'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/i18n/provider'
import type { PageMeta } from '@/shared/error-codes'

export function PaginationBar({ meta, onPageChange }: { meta: PageMeta; onPageChange: (page: number) => void }) {
  const { t } = useI18n()
  if (meta.total === 0) return null
  const from = (meta.page - 1) * meta.limit + 1
  const to = Math.min(meta.total, meta.page * meta.limit)
  return (
    <nav className="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row" aria-label="Pagination">
      <p className="text-sm text-muted-foreground tabular-nums">{t('common.showing', { from, to, total: meta.total })}</p>
      {meta.pages > 1 && (
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={meta.page <= 1} onClick={() => onPageChange(meta.page - 1)}>
            <ChevronLeft aria-hidden="true" />
            {t('action.previous')}
          </Button>
          <span className="min-w-20 text-center text-sm tabular-nums text-muted-foreground">
            {meta.page} / {meta.pages}
          </span>
          <Button variant="outline" size="sm" disabled={meta.page >= meta.pages} onClick={() => onPageChange(meta.page + 1)}>
            {t('action.next')}
            <ChevronRight aria-hidden="true" />
          </Button>
        </div>
      )}
    </nav>
  )
}
