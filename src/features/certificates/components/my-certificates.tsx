'use client'

import Link from 'next/link'
import { Award, BookOpen } from 'lucide-react'
import { EmptyState } from '@/components/shared/empty-state'
import { ErrorState } from '@/components/shared/error-state'
import { PageHeader } from '@/components/shared/page-header'
import { CardGridSkeleton } from '@/components/shared/page-loader'
import { PaginationBar } from '@/components/shared/pagination-bar'
import { Button } from '@/components/ui/button'
import { useUrlState } from '@/hooks/use-url-state'
import { useI18n } from '@/i18n/provider'
import { routes } from '@/lib/routes'
import { useCertificates } from '../api'
import { CertificateCard } from './certificate-card'

const PAGE_SIZE = 12

export function MyCertificates() {
  const { t } = useI18n()
  const [filters, setFilters] = useUrlState({ page: '1' })
  const certificates = useCertificates({ page: Number(filters.page) || 1, limit: PAGE_SIZE })

  return (
    <div>
      <PageHeader title={t('certificates.mine.title')} description={t('certificates.mine.description')} />
      {certificates.isPending ? (
        <CardGridSkeleton className="h-96" count={3} />
      ) : certificates.isError ? (
        <ErrorState error={certificates.error} onRetry={() => certificates.refetch()} />
      ) : certificates.data.items.length === 0 ? (
        <EmptyState
          icon={Award}
          title={t('certificates.mine.empty')}
          description={t('certificates.mine.emptyHint')}
          action={
            <Button asChild>
              <Link href={routes.courses}>
                <BookOpen aria-hidden="true" />
                {t('certificates.mine.toCourses')}
              </Link>
            </Button>
          }
        />
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3" aria-busy={certificates.isFetching}>
            {certificates.data.items.map((certificate) => (
              <CertificateCard key={certificate.id} certificate={certificate} />
            ))}
          </div>
          <PaginationBar meta={certificates.data.meta} onPageChange={(page) => setFilters({ page })} />
        </>
      )}
    </div>
  )
}
