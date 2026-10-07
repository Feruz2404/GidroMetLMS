'use client'

import Link from 'next/link'
import { Award } from 'lucide-react'
import { StatusBadge } from '@/components/shared/status-badge'
import { useI18n } from '@/i18n/provider'
import { routes } from '@/lib/routes'
import type { CertificateReportRowDto } from '@/shared/dto'
import { useReport } from '../api'
import { PercentCell, TwoLineCell } from './cells'
import { ReportTable, type ReportColumn } from './report-table'

export function CertificatesReport() {
  const { t, formatNumber, formatDate } = useI18n()
  const query = useReport('certificates')

  const columns: ReportColumn<CertificateReportRowDto>[] = [
    {
      key: 'number',
      header: t('reports.col.certNumber'),
      cell: (row) => (
        <Link href={routes.certificate(row.id)} className="whitespace-nowrap font-mono text-xs font-medium hover:text-primary focus-visible:underline focus-visible:outline-none">
          {row.certNumber}
        </Link>
      ),
      sortValue: (row) => row.certNumber,
    },
    { key: 'learner', header: t('reports.col.learner'), cell: (row) => <TwoLineCell primary={row.learner} secondary={row.department} />, sortValue: (row) => row.learner },
    {
      key: 'course',
      header: t('reports.col.course'),
      cell: (row) => <span className="line-clamp-2 min-w-40 max-w-72 whitespace-normal">{row.course}</span>,
      sortValue: (row) => row.course,
      hideOnMobile: true,
    },
    {
      key: 'percentage',
      header: t('common.result'),
      cell: (row) => <PercentCell value={row.percentage} />,
      sortValue: (row) => row.percentage,
      className: 'text-right tabular-nums',
      hideOnMobile: true,
    },
    {
      key: 'issuedAt',
      header: t('reports.col.issuedAt'),
      cell: (row) => <span className="whitespace-nowrap">{formatDate(row.issuedAt, 'medium')}</span>,
      sortValue: (row) => Date.parse(row.issuedAt),
    },
    {
      key: 'validUntil',
      header: t('reports.col.validUntil'),
      cell: (row) => <span className="whitespace-nowrap">{row.validUntil ? formatDate(row.validUntil, 'medium') : t('reports.noExpiry')}</span>,
      sortValue: (row) => (row.validUntil ? Date.parse(row.validUntil) : null),
      hideOnMobile: true,
    },
    { key: 'status', header: t('common.status'), cell: (row) => <StatusBadge status={row.status} />, sortValue: (row) => row.status },
  ]

  return (
    <ReportTable
      type="certificates"
      query={query}
      columns={columns}
      rowKey={(row) => row.id}
      searchText={(row) => [row.certNumber, row.learner, row.department, row.course].join(' ')}
      searchPlaceholder={t('reports.search.certificates')}
      empty={{ icon: Award, title: t('reports.empty.certificates'), description: t('reports.empty.hint') }}
      summary={(rows) => {
        const count = (status: CertificateReportRowDto['status']) => formatNumber(rows.filter((row) => row.status === status).length)
        return [
          { label: t('common.total'), value: formatNumber(rows.length) },
          { label: t('status.active'), value: count('active') },
          { label: t('status.expired'), value: count('expired') },
          { label: t('status.revoked'), value: count('revoked') },
        ]
      }}
    />
  )
}
