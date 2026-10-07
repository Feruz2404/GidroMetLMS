'use client'

import { ScrollText } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { MessageKey } from '@/i18n'
import { useI18n } from '@/i18n/provider'
import type { AuditReportRowDto } from '@/shared/dto'
import { isRole } from '@/shared/roles'
import { useReport } from '../api'
import { TwoLineCell } from './cells'
import { ReportTable, type ReportColumn } from './report-table'

export function AuditReport() {
  const { t, formatDate } = useI18n()
  const query = useReport('audit')

  // Codes without a translation (added on the server later) are shown as-is.
  const labelOf = (prefix: 'reports.action' | 'reports.entity', code: string) => {
    const key = `${prefix}.${code}`
    const label = t(key as MessageKey)
    return label === key ? code : label
  }
  const roleLabel = (role: string) => (isRole(role) ? t(`role.${role}`) : role)

  const columns: ReportColumn<AuditReportRowDto>[] = [
    {
      key: 'time',
      header: t('reports.col.time'),
      cell: (row) => <span className="whitespace-nowrap tabular-nums">{formatDate(row.createdAt, 'datetime')}</span>,
      sortValue: (row) => Date.parse(row.createdAt),
    },
    { key: 'user', header: t('reports.col.user'), cell: (row) => <TwoLineCell primary={row.user} secondary={row.email} />, sortValue: (row) => row.user },
    { key: 'role', header: t('common.role'), cell: (row) => <Badge variant="muted">{roleLabel(row.role)}</Badge>, sortValue: (row) => roleLabel(row.role), hideOnMobile: true },
    {
      key: 'action',
      header: t('reports.col.action'),
      cell: (row) => <span className="font-medium">{labelOf('reports.action', row.action)}</span>,
      sortValue: (row) => labelOf('reports.action', row.action),
    },
    {
      key: 'entity',
      header: t('reports.col.entity'),
      cell: (row) =>
        row.entity ? (
          <TwoLineCell primary={labelOf('reports.entity', row.entity)} secondary={row.entityId && <span className="font-mono">{row.entityId}</span>} />
        ) : (
          <span className="text-muted-foreground">{t('common.none')}</span>
        ),
      sortValue: (row) => (row.entity ? labelOf('reports.entity', row.entity) : null),
      hideOnMobile: true,
    },
    {
      key: 'ip',
      header: t('reports.col.ip'),
      cell: (row) => <span className="font-mono text-xs text-muted-foreground">{row.ipAddress ?? t('common.none')}</span>,
      sortValue: (row) => row.ipAddress,
      hideOnMobile: true,
    },
  ]

  return (
    <ReportTable
      type="audit"
      query={query}
      columns={columns}
      rowKey={(row) => row.id}
      searchText={(row) => [row.user, row.email, roleLabel(row.role), row.action, labelOf('reports.action', row.action), row.entity, row.ipAddress].join(' ')}
      searchPlaceholder={t('reports.search.audit')}
      empty={{ icon: ScrollText, title: t('reports.empty.audit') }}
      note={query.data ? t('reports.audit.note', { count: query.data.length }) : undefined}
    />
  )
}
