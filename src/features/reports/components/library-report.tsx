'use client'

import Link from 'next/link'
import { Library } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useI18n } from '@/i18n/provider'
import { routes } from '@/lib/routes'
import type { LibraryReportRowDto } from '@/shared/dto'
import { useReport } from '../api'
import { CountCell } from './cells'
import { ReportTable, type ReportColumn } from './report-table'

const NUMERIC = 'text-right tabular-nums'

export function LibraryReport() {
  const { t, formatNumber } = useI18n()
  const query = useReport('library')
  const typeLabel = (type: LibraryReportRowDto['type']) => t(`reports.resourceType.${type}`)

  const columns: ReportColumn<LibraryReportRowDto>[] = [
    {
      key: 'title',
      header: t('reports.col.resource'),
      cell: (row) => (
        <Link href={routes.resource(row.id)} className="line-clamp-2 min-w-48 max-w-96 whitespace-normal font-medium hover:text-primary focus-visible:underline focus-visible:outline-none">
          {row.title}
        </Link>
      ),
      sortValue: (row) => row.title,
    },
    { key: 'type', header: t('common.type'), cell: (row) => <Badge variant="muted">{typeLabel(row.type)}</Badge>, sortValue: (row) => typeLabel(row.type) },
    { key: 'category', header: t('common.category'), cell: (row) => row.category ?? t('common.none'), sortValue: (row) => row.category, hideOnMobile: true },
    { key: 'views', header: t('reports.col.views'), cell: (row) => <CountCell value={row.views} />, sortValue: (row) => row.views, className: NUMERIC },
    { key: 'downloads', header: t('reports.col.downloads'), cell: (row) => <CountCell value={row.downloads} />, sortValue: (row) => row.downloads, className: NUMERIC },
    {
      key: 'bookmarks',
      header: t('reports.col.bookmarks'),
      cell: (row) => <CountCell value={row.bookmarks} />,
      sortValue: (row) => row.bookmarks,
      className: NUMERIC,
      hideOnMobile: true,
    },
  ]

  return (
    <ReportTable
      type="library"
      query={query}
      columns={columns}
      rowKey={(row) => row.id}
      searchText={(row) => [row.title, row.category, typeLabel(row.type)].join(' ')}
      searchPlaceholder={t('reports.search.library')}
      empty={{ icon: Library, title: t('reports.empty.library'), description: t('reports.empty.hint') }}
      summary={(rows) => {
        const sum = (pick: (row: LibraryReportRowDto) => number) => formatNumber(rows.reduce((total, row) => total + pick(row), 0))
        return [
          { label: t('reports.summary.resources'), value: formatNumber(rows.length) },
          { label: t('reports.summary.views'), value: sum((row) => row.views) },
          { label: t('reports.summary.downloads'), value: sum((row) => row.downloads) },
          { label: t('reports.summary.bookmarks'), value: sum((row) => row.bookmarks) },
        ]
      }}
    />
  )
}
