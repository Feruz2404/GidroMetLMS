'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Archive, ArchiveRestore, ExternalLink, FileX, Link2, Loader2, Pencil } from 'lucide-react'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { EmptyState } from '@/components/shared/empty-state'
import { ErrorState } from '@/components/shared/error-state'
import { PageHeader } from '@/components/shared/page-header'
import { SectionCard } from '@/components/shared/section-card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useI18n } from '@/i18n/provider'
import { ApiError } from '@/lib/api-client'
import { routes } from '@/lib/routes'
import { useErrorToast } from '@/lib/use-api-error'
import type { LibraryResourceDto } from '@/shared/dto'
import { useArchiveResource, useRelatedResources, useResource, useUpdateResource } from './api'
import { BookmarkButton } from './components/bookmark-button'
import { ResourceCompactCard, ResourceTags } from './components/resource-card'
import { ResourceFormDialog } from './components/resource-form-dialog'
import { ResourceCover } from './components/resource-type'
import { byline, useLibraryLabels } from './labels'
import { useOpenDocument } from './use-open-document'

export function ResourcePage({ id }: { id: string }) {
  const { t } = useI18n()
  const resource = useResource(id)

  if (resource.isPending) return <ResourceSkeleton />
  if (resource.isError) {
    if (resource.error instanceof ApiError && resource.error.status === 404) {
      return (
        <EmptyState
          icon={FileX}
          title={t('library.detail.notFound')}
          description={t('library.detail.notFoundHint')}
          action={
            <Button asChild variant="outline">
              <Link href={routes.library}>{t('library.detail.back')}</Link>
            </Button>
          }
        />
      )
    }
    return <ErrorState error={resource.error} onRetry={() => resource.refetch()} />
  }
  return <ResourceView resource={resource.data} />
}

function ResourceView({ resource }: { resource: LibraryResourceDto }) {
  const { t, formatDate } = useI18n()
  const labels = useLibraryLabels()
  const [editing, setEditing] = useState(false)
  const archived = resource.status === 'archived'

  return (
    <div className="space-y-6">
      <PageHeader
        back={{ href: routes.library, label: t('library.detail.back') }}
        eyebrow={[labels.type(resource.type), resource.category].filter(Boolean).join(' · ')}
        title={resource.title}
        description={byline(resource) || undefined}
        actions={resource.canManage && <ManageActions resource={resource} onEdit={() => setEditing(true)} />}
      />

      {archived && (
        <Alert className="border-warning/40 bg-warning/10">
          <Archive aria-hidden="true" />
          <AlertDescription>{t('library.detail.archivedNotice')}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <ActionPanel resource={resource} />

        <div className="min-w-0 space-y-6 lg:order-first">
          <SectionCard title={t('library.detail.about')}>
            {resource.description ? (
              <p className="max-w-[72ch] whitespace-pre-line text-[0.95rem] leading-7">{resource.description}</p>
            ) : (
              <p className="text-sm text-muted-foreground">{t('library.detail.noDescription')}</p>
            )}
            {resource.tags.length > 0 && (
              <div className="mt-5 border-t pt-4">
                <h3 className="sr-only">{t('library.field.tags')}</h3>
                <ResourceTags tags={resource.tags} />
              </div>
            )}
          </SectionCard>

          <SectionCard title={t('library.detail.details')}>
            <dl className="grid gap-x-6 gap-y-5 sm:grid-cols-2 xl:grid-cols-3">
              <Detail label={t('common.author')} value={resource.author} />
              <Detail label={t('library.field.publisher')} value={resource.publisher} />
              <Detail label={t('common.year')} value={resource.year} />
              <Detail label={t('common.language')} value={labels.language(resource.language)} />
              <Detail label={t('library.field.pages')} value={resource.pages} />
              <Detail label={t('library.field.fileType')} value={resource.fileType?.toUpperCase()} />
              <Detail label={t('common.category')} value={resource.category} />
              <Detail label={t('library.field.fileSize')} value={resource.fileSize > 0 ? <FileSize bytes={resource.fileSize} /> : null} />
              <Detail label={t('library.field.addedAt')} value={formatDate(resource.createdAt, 'short')} />
            </dl>
          </SectionCard>
        </div>
      </div>

      <RelatedResources id={resource.id} />

      {resource.canManage && <ResourceFormDialog open={editing} onOpenChange={setEditing} resource={resource} />}
    </div>
  )
}

function ActionPanel({ resource }: { resource: LibraryResourceDto }) {
  const { t, formatNumber } = useI18n()
  const { open, pendingId } = useOpenDocument()
  const pending = pendingId === resource.id

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast.success(t('library.linkCopied'))
    } catch {
      toast.error(t('library.copyFailed'))
    }
  }

  const stats = [
    { label: t('library.stats.views'), value: resource.viewCount },
    { label: t('library.stats.downloads'), value: resource.downloadCount },
    { label: t('library.stats.bookmarks'), value: resource.bookmarkCount },
  ]

  return (
    <aside className="h-fit overflow-hidden rounded-xl border bg-card shadow-[var(--shadow-card)] lg:sticky lg:top-24">
      <ResourceCover type={resource.type} fileType={resource.fileType} className="h-44" />
      <div className="space-y-3 p-5">
        <Button size="lg" className="w-full" onClick={() => open(resource.id)} disabled={!resource.fileUrl || pending}>
          {pending ? <Loader2 className="animate-spin" aria-hidden="true" /> : <ExternalLink aria-hidden="true" />}
          {t('library.openDocument')}
        </Button>
        {!resource.fileUrl && <p className="text-center text-xs text-muted-foreground">{t('library.noFile')}</p>}
        <div className="grid grid-cols-2 gap-2">
          <BookmarkButton resource={resource} variant="full" />
          <Button variant="outline" onClick={copyLink}>
            <Link2 aria-hidden="true" />
            {t('library.copyLink')}
          </Button>
        </div>
      </div>
      <dl className="grid grid-cols-3 divide-x border-t">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col-reverse items-center gap-0.5 px-2 py-4 text-center">
            <dt className="text-xs text-muted-foreground">{stat.label}</dt>
            <dd className="text-lg font-semibold tabular-nums">{formatNumber(stat.value)}</dd>
          </div>
        ))}
      </dl>
    </aside>
  )
}

function ManageActions({ resource, onEdit }: { resource: LibraryResourceDto; onEdit: () => void }) {
  const { t } = useI18n()
  const archive = useArchiveResource()
  const update = useUpdateResource()
  const onError = useErrorToast()

  const restore = () =>
    update.mutate(
      { id: resource.id, input: { status: 'active' } },
      { onSuccess: () => toast.success(t('library.restored')), onError }
    )

  return (
    <>
      <Button variant="outline" onClick={onEdit}>
        <Pencil aria-hidden="true" />
        {t('action.edit')}
      </Button>
      {resource.status === 'archived' ? (
        <Button variant="outline" onClick={restore} disabled={update.isPending}>
          {update.isPending ? <Loader2 className="animate-spin" aria-hidden="true" /> : <ArchiveRestore aria-hidden="true" />}
          {t('library.restore')}
        </Button>
      ) : (
        <ConfirmDialog
          destructive
          title={t('library.archive.title')}
          description={t('library.archive.description', { title: resource.title })}
          confirmLabel={t('action.archive')}
          onConfirm={async () => {
            try {
              await archive.mutateAsync(resource.id)
              toast.success(t('library.archive.done'))
            } catch (error) {
              onError(error)
            }
          }}
          trigger={
            <Button variant="outline" className="text-destructive hover:text-destructive">
              <Archive aria-hidden="true" />
              {t('action.archive')}
            </Button>
          }
        />
      )}
    </>
  )
}

function RelatedResources({ id }: { id: string }) {
  const { t } = useI18n()
  const related = useRelatedResources(id)
  if (related.isError || related.data?.length === 0) return null
  return (
    <section aria-labelledby="related-heading" className="space-y-4">
      <div>
        <h2 id="related-heading" className="text-lg font-semibold tracking-tight">
          {t('library.detail.related')}
        </h2>
        <p className="text-sm text-muted-foreground">{t('library.detail.relatedHint')}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {related.isPending
          ? Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="h-28 rounded-xl" />)
          : related.data.map((resource) => <ResourceCompactCard key={resource.id} resource={resource} />)}
      </div>
    </section>
  )
}

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  const { t } = useI18n()
  return (
    <div className="min-w-0 space-y-1">
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="break-words text-sm font-medium">{value ?? t('common.none')}</dd>
    </div>
  )
}

const BYTE_UNITS = ['byte', 'kilobyte', 'megabyte', 'gigabyte'] as const

function FileSize({ bytes }: { bytes: number }) {
  const { formatNumber } = useI18n()
  const exponent = Math.min(BYTE_UNITS.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)))
  return <>{formatNumber(bytes / 1024 ** exponent, { style: 'unit', unit: BYTE_UNITS[exponent], unitDisplay: 'short', maximumFractionDigits: 1 })}</>
}

function ResourceSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true">
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
      </div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-56 rounded-xl" />
        </div>
        <Skeleton className="h-96 rounded-xl" />
      </div>
    </div>
  )
}
