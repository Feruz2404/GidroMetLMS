'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Award, BadgeCheck, Ban, Eye, Loader2, Plus, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { DataTable, type Column } from '@/components/shared/data-table'
import { EmptyState } from '@/components/shared/empty-state'
import { ErrorState } from '@/components/shared/error-state'
import { FilterSelect } from '@/components/shared/filter-select'
import { PageHeader } from '@/components/shared/page-header'
import { PaginationBar } from '@/components/shared/pagination-bar'
import { SearchInput } from '@/components/shared/search-input'
import { StatusBadge } from '@/components/shared/status-badge'
import { Button } from '@/components/ui/button'
import { useSession } from '@/features/auth/session'
import { useCourses } from '@/features/courses/api'
import { useUrlState } from '@/hooks/use-url-state'
import { useI18n } from '@/i18n/provider'
import { routes } from '@/lib/routes'
import { useErrorToast } from '@/lib/use-api-error'
import type { CertificateDto, CertificateStatus, CertificateSyncResultDto } from '@/shared/dto'
import { PERMISSIONS } from '@/shared/roles'
import { useCertificates, useSyncCertificates } from '../api'
import { IssueCertificateDialog } from './issue-dialog'
import { RevokeDialog } from './revoke-dialog'

const PAGE_SIZE = 15
const SYNC_PREVIEW = 5
const STATUSES: CertificateStatus[] = ['active', 'revoked', 'expired']

export function CertificateRegistry() {
  const { t, formatDate } = useI18n()
  const session = useSession()
  const canManage = session.can(PERMISSIONS.CERTIFICATES_MANAGE)
  const canIssue = canManage || session.canManageContent
  const [filters, setFilters] = useUrlState({ q: '', status: '', course: '', page: '1' })
  const [issueOpen, setIssueOpen] = useState(false)
  const [revoking, setRevoking] = useState<{ open: boolean; certificate: CertificateDto | null }>({ open: false, certificate: null })
  const courses = useCourses({ view: session.canManageContent ? 'managed' : 'all', sort: 'title', limit: 100 })
  const certificates = useCertificates({
    search: filters.q || undefined,
    status: (filters.status || undefined) as CertificateStatus | undefined,
    courseId: filters.course || undefined,
    page: Number(filters.page) || 1,
    limit: PAGE_SIZE,
  })
  const filtered = Boolean(filters.q || filters.status || filters.course)

  const columns: Column<CertificateDto>[] = [
    {
      key: 'number',
      header: t('certificates.field.number'),
      cell: (certificate) => (
        <div className="min-w-0">
          <Link href={routes.certificate(certificate.id)} className="font-mono text-sm font-semibold text-primary hover:underline">
            {certificate.certNumber}
          </Link>
          <div className="max-w-44 md:hidden">
            <p className="truncate text-sm font-medium">{certificate.recipient.fullName}</p>
            <p className="truncate text-xs text-muted-foreground">{certificate.course.title}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'recipient',
      header: t('certificates.field.recipient'),
      hideOnMobile: true,
      className: 'max-w-60',
      cell: (certificate) => (
        <div className="min-w-0">
          <p className="truncate font-medium">{certificate.recipient.fullName}</p>
          {certificate.recipient.department && <p className="truncate text-xs text-muted-foreground">{certificate.recipient.department}</p>}
        </div>
      ),
    },
    {
      key: 'course',
      header: t('certificates.field.course'),
      hideOnMobile: true,
      className: 'max-w-64',
      cell: (certificate) => <p className="line-clamp-2 whitespace-normal">{certificate.course.title}</p>,
    },
    {
      key: 'score',
      header: t('certificates.field.score'),
      hideOnMobile: true,
      cell: (certificate) => <span className="font-medium tabular-nums">{Math.round(certificate.percentage)}%</span>,
    },
    {
      key: 'issued',
      header: t('certificates.field.issued'),
      hideOnMobile: true,
      cell: (certificate) => <span className="tabular-nums">{formatDate(certificate.issuedAt, 'short')}</span>,
    },
    {
      key: 'valid',
      header: t('certificates.field.validUntil'),
      className: 'hidden xl:table-cell',
      cell: (certificate) => (
        <span className="tabular-nums">{certificate.validUntil ? formatDate(certificate.validUntil, 'short') : t('certificates.sheet.indefinite')}</span>
      ),
    },
    { key: 'status', header: t('common.status'), cell: (certificate) => <StatusBadge status={certificate.status} /> },
    {
      key: 'actions',
      header: <span className="sr-only">{t('common.actions')}</span>,
      className: 'text-right',
      cell: (certificate) => (
        <div className="flex justify-end gap-1">
          <Button asChild variant="ghost" size="icon-sm" aria-label={t('action.view')} title={t('action.view')} className="hidden sm:inline-flex">
            <Link href={routes.certificate(certificate.id)}>
              <Eye aria-hidden="true" />
            </Link>
          </Button>
          {canManage && certificate.status !== 'revoked' && (
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              aria-label={t('certificates.revoke.action')}
              title={t('certificates.revoke.action')}
              onClick={() => setRevoking({ open: true, certificate })}
            >
              <Ban aria-hidden="true" />
            </Button>
          )}
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title={t('certificates.registry.title')}
        description={t('certificates.registry.description')}
        actions={
          <>
            {canManage && <SyncButton />}
            {canIssue && (
              <Button onClick={() => setIssueOpen(true)}>
                <Plus aria-hidden="true" />
                {t('certificates.issue.action')}
              </Button>
            )}
          </>
        }
      />

      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center">
        <SearchInput value={filters.q} onChange={(q) => setFilters({ q })} placeholder={t('certificates.registry.search')} className="lg:max-w-sm lg:flex-1" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex">
          <FilterSelect
            value={filters.status}
            onChange={(status) => setFilters({ status })}
            allLabel={t('certificates.filter.allStatuses')}
            ariaLabel={t('common.status')}
            options={STATUSES.map((status) => ({ value: status, label: t(`status.${status}`) }))}
            className="sm:w-full lg:w-48"
          />
          <FilterSelect
            value={filters.course}
            onChange={(course) => setFilters({ course })}
            allLabel={t('certificates.filter.allCourses')}
            ariaLabel={t('certificates.field.course')}
            options={(courses.data?.items ?? []).map((course) => ({ value: course.id, label: course.title }))}
            className="sm:w-full lg:w-72"
          />
        </div>
      </div>

      {certificates.isError ? (
        <ErrorState error={certificates.error} onRetry={() => certificates.refetch()} />
      ) : (
        <>
          <DataTable
            columns={columns}
            rows={certificates.data?.items}
            rowKey={(certificate) => certificate.id}
            loading={certificates.isPending}
            empty={
              <EmptyState
                compact
                className="border-0 bg-transparent"
                icon={Award}
                title={filtered ? t('state.noResults') : t('certificates.registry.empty')}
                description={filtered ? t('state.noResultsHint') : t('certificates.registry.emptyHint')}
                action={
                  filtered && (
                    <Button variant="outline" size="sm" onClick={() => setFilters({ q: '', status: '', course: '' })}>
                      {t('action.reset')}
                    </Button>
                  )
                }
              />
            }
          />
          {certificates.data && <PaginationBar meta={certificates.data.meta} onPageChange={(page) => setFilters({ page })} />}
        </>
      )}

      {canIssue && <IssueCertificateDialog open={issueOpen} onOpenChange={setIssueOpen} />}
      {canManage && (
        <RevokeDialog certificate={revoking.certificate} open={revoking.open} onOpenChange={(open) => setRevoking((current) => ({ ...current, open }))} />
      )}
    </div>
  )
}

function SyncButton() {
  const { t } = useI18n()
  const sync = useSyncCertificates()
  const onError = useErrorToast()

  const run = () =>
    sync.mutate(undefined, {
      onSuccess: (result) => {
        if (result.created === 0) toast.info(t('certificates.sync.none'))
        else toast.success(t('certificates.sync.done', { count: result.created }), { description: <SyncSummary result={result} />, duration: 10_000 })
      },
      onError,
    })

  return (
    <Button variant="outline" onClick={run} disabled={sync.isPending}>
      {sync.isPending ? <Loader2 className="animate-spin" aria-hidden="true" /> : <Sparkles aria-hidden="true" />}
      {t('certificates.sync.action')}
    </Button>
  )
}

function SyncSummary({ result }: { result: CertificateSyncResultDto }) {
  const { t } = useI18n()
  const hidden = result.certificates.length - SYNC_PREVIEW
  return (
    <ul className="mt-1 space-y-1">
      {result.certificates.slice(0, SYNC_PREVIEW).map((certificate) => (
        <li key={certificate.id} className="flex items-start gap-1.5">
          <BadgeCheck className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
          <span>
            {certificate.recipientName} — {certificate.courseTitle}
          </span>
        </li>
      ))}
      {hidden > 0 && <li>{t('certificates.sync.more', { count: hidden })}</li>}
    </ul>
  )
}
