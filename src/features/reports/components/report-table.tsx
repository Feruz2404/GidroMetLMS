'use client'

import { useState } from 'react'
import type { UseQueryResult } from '@tanstack/react-query'
import { ArrowDown, ArrowUp, ChevronsUpDown, Download, type LucideIcon } from 'lucide-react'
import { DataTable, type Column } from '@/components/shared/data-table'
import { EmptyState } from '@/components/shared/empty-state'
import { ErrorState } from '@/components/shared/error-state'
import { PaginationBar } from '@/components/shared/pagination-bar'
import { SearchInput } from '@/components/shared/search-input'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { MetricStrip, type Metric } from '@/features/dashboard/components/metric-strip'
import { INTL_LOCALE } from '@/i18n/config'
import { useI18n } from '@/i18n/provider'
import { exportUrl } from '@/lib/api-client'
import { cn } from '@/lib/utils'
import type { TabularReportType } from '../api'

type SortValue = string | number | null

export interface ReportColumn<T> extends Column<T> {
  /** Sort key for the column; numbers sort largest first on the first click, text A→Z. */
  sortValue?: (row: T) => SortValue
}

interface SortState {
  key: string
  dir: 'asc' | 'desc'
}

interface ReportTableProps<T> {
  type: TabularReportType
  query: UseQueryResult<T[]>
  columns: ReportColumn<T>[]
  rowKey: (row: T) => string
  searchText: (row: T) => string
  searchPlaceholder: string
  summary?: (rows: T[]) => Metric[]
  empty: { icon: LucideIcon; title: string; description?: string }
  note?: string
}

const PAGE_SIZE = 25

function compare(a: SortValue, b: SortValue, dir: SortState['dir'], collator: Intl.Collator): number {
  // Missing values stay at the bottom in both directions.
  if (a === null) return b === null ? 0 : 1
  if (b === null) return -1
  const result = typeof a === 'number' && typeof b === 'number' ? a - b : collator.compare(String(a), String(b))
  return dir === 'asc' ? result : -result
}

/** A tabular report: summary figures, client-side search, sortable columns, paging and CSV export. */
export function ReportTable<T>({ type, query, columns, rowKey, searchText, searchPlaceholder, summary, empty, note }: ReportTableProps<T>) {
  const { t, locale } = useI18n()
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortState | null>(null)
  const [page, setPage] = useState(1)

  if (query.isError) return <ErrorState error={query.error} onRetry={() => query.refetch()} />

  const rows = query.data
  if (rows && rows.length === 0) return <EmptyState icon={empty.icon} title={empty.title} description={empty.description} />

  const intl = INTL_LOCALE[locale]
  const needle = search.trim().toLocaleLowerCase(intl)
  const filtered = needle ? (rows ?? []).filter((row) => searchText(row).toLocaleLowerCase(intl).includes(needle)) : (rows ?? [])
  const sortValue = sort ? columns.find((column) => column.key === sort.key)?.sortValue : undefined
  const collator = new Intl.Collator(intl, { numeric: true, sensitivity: 'base' })
  const sorted = sort && sortValue ? [...filtered].sort((a, b) => compare(sortValue(a), sortValue(b), sort.dir, collator)) : filtered
  const pages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const current = Math.min(page, pages)
  const pageRows = sorted.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)

  const toggleSort = (column: ReportColumn<T>) => {
    setPage(1)
    setSort((previous) => {
      if (previous?.key === column.key) return { key: column.key, dir: previous.dir === 'asc' ? 'desc' : 'asc' }
      const sample = rows?.map((row) => column.sortValue!(row)).find((value) => value !== null)
      return { key: column.key, dir: typeof sample === 'number' ? 'desc' : 'asc' }
    })
  }

  const tableColumns: Column<T>[] = columns.map((column) => {
    if (!column.sortValue) return column
    const active = sort?.key === column.key ? sort.dir : null
    const Icon = active === 'asc' ? ArrowUp : active === 'desc' ? ArrowDown : ChevronsUpDown
    return {
      ...column,
      header: (
        // Long headers may wrap so narrow numeric columns stay narrow.
        <button
          type="button"
          onClick={() => toggleSort(column)}
          className={cn(
            'inline-flex items-center gap-1 whitespace-normal rounded-sm text-left uppercase leading-tight tracking-wide transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
            column.className?.includes('text-right') && 'justify-end text-right',
            active && 'text-foreground'
          )}
        >
          {column.header}
          <Icon className={cn('size-3.5 shrink-0', !active && 'opacity-50')} aria-hidden="true" />
          <span className="sr-only">{active ? t(active === 'asc' ? 'reports.sort.asc' : 'reports.sort.desc') : t('reports.sort.none')}</span>
        </button>
      ),
    }
  })

  return (
    <div className="space-y-4">
      {summary && (rows ? <MetricStrip items={summary(rows)} /> : <Skeleton className="h-[74px] rounded-xl" />)}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          value={search}
          onChange={(value) => {
            setSearch(value)
            setPage(1)
          }}
          placeholder={searchPlaceholder}
          className="sm:max-w-sm sm:flex-1"
        />
        <div className="flex items-center justify-between gap-3 sm:justify-end">
          {rows && (
            <span className="text-sm tabular-nums text-muted-foreground" aria-live="polite">
              {t('reports.rows', { count: sorted.length })}
            </span>
          )}
          <Button asChild variant="outline">
            <a href={exportUrl('/reports', { type })} download>
              <Download aria-hidden="true" />
              {t('action.exportCsv')}
            </a>
          </Button>
        </div>
      </div>

      {note && <p className="text-xs text-muted-foreground">{note}</p>}

      <DataTable
        columns={tableColumns}
        rows={pageRows}
        rowKey={rowKey}
        loading={query.isPending}
        empty={
          <EmptyState
            compact
            className="border-0 bg-transparent"
            title={t('state.noResults')}
            description={t('state.noResultsHint')}
            action={
              <Button variant="outline" size="sm" onClick={() => setSearch('')}>
                {t('action.reset')}
              </Button>
            }
          />
        }
      />
      <PaginationBar meta={{ total: sorted.length, page: current, pages, limit: PAGE_SIZE }} onPageChange={setPage} />
    </div>
  )
}
