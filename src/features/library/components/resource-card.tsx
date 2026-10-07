'use client'

import Link from 'next/link'
import { CalendarDays, Download, ExternalLink, Eye, FileStack, Languages, Loader2, Pencil } from 'lucide-react'
import { StatusBadge } from '@/components/shared/status-badge'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/i18n/provider'
import { routes } from '@/lib/routes'
import { cn } from '@/lib/utils'
import type { LibraryResourceDto } from '@/shared/dto'
import { byline, useLibraryLabels } from '../labels'
import { useOpenDocument } from '../use-open-document'
import { BookmarkButton } from './bookmark-button'
import { ResourceCover, ResourceThumb } from './resource-type'

interface ResourceItemProps {
  resource: LibraryResourceDto
  onEdit?: (resource: LibraryResourceDto) => void
}

export function ResourceCard({ resource, onEdit }: ResourceItemProps) {
  const { t } = useI18n()
  const labels = useLibraryLabels()
  const by = byline(resource)
  const href = routes.resource(resource.id)

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border bg-card shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-elevated)]">
      <ResourceCover type={resource.type} fileType={resource.fileType} className="h-36">
        <div className="flex items-start justify-between gap-2 p-4">
          <span className="rounded-full bg-white/20 px-2.5 py-1 text-xs font-medium backdrop-blur-sm">{labels.type(resource.type)}</span>
          <div className="relative z-10 flex items-center gap-1">
            {resource.canManage && onEdit && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => onEdit(resource)}
                aria-label={t('action.edit')}
                title={t('action.edit')}
                className="bg-white/15 text-white backdrop-blur-sm hover:bg-white/25 hover:text-white dark:hover:bg-white/25"
              >
                <Pencil aria-hidden="true" />
              </Button>
            )}
            <BookmarkButton resource={resource} variant="overlay" />
          </div>
        </div>
      </ResourceCover>

      <div className="flex flex-1 flex-col gap-2.5 p-5">
        {(resource.category || resource.status === 'archived') && (
          <div className="flex min-w-0 items-center gap-2">
            {resource.status === 'archived' && <StatusBadge status="archived" />}
            {resource.category && <p className="truncate text-xs font-semibold uppercase tracking-wider text-primary">{resource.category}</p>}
          </div>
        )}
        <h3 className="line-clamp-2 text-[1.05rem] font-semibold leading-snug tracking-tight">
          <Link href={href} className="after:absolute after:inset-0 after:content-[''] focus-visible:underline group-hover:text-primary">
            {resource.title}
          </Link>
        </h3>
        {by && <p className="line-clamp-1 text-sm text-muted-foreground">{by}</p>}
        <ResourceMeta resource={resource} />
        <ResourceTags tags={resource.tags} limit={2} />

        <div className="mt-auto flex items-center justify-between gap-3 border-t pt-4">
          <ResourceStats resource={resource} />
          <OpenDocumentButton resource={resource} />
        </div>
      </div>
    </article>
  )
}

export function ResourceRow({ resource, onEdit }: ResourceItemProps) {
  const { t } = useI18n()
  const labels = useLibraryLabels()
  const by = byline(resource)

  return (
    <article className="group relative flex items-center gap-4 px-4 py-4 transition-colors hover:bg-muted/40 sm:px-5">
      <ResourceThumb type={resource.type} className="hidden sm:flex" />
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-xs">
          <span className="font-medium text-muted-foreground">{labels.type(resource.type)}</span>
          {resource.category && (
            <>
              <span className="text-muted-foreground/50" aria-hidden="true">•</span>
              <span className="truncate font-semibold uppercase tracking-wider text-primary">{resource.category}</span>
            </>
          )}
          {resource.status === 'archived' && <StatusBadge status="archived" />}
        </div>
        <h3 className="line-clamp-2 font-semibold leading-snug tracking-tight sm:line-clamp-1">
          <Link href={routes.resource(resource.id)} className="after:absolute after:inset-0 after:content-[''] focus-visible:underline group-hover:text-primary">
            {resource.title}
          </Link>
        </h3>
        {by && <p className="truncate text-sm text-muted-foreground">{by}</p>}
        <ResourceMeta resource={resource} />
      </div>
      <ResourceStats resource={resource} className="hidden lg:flex" />
      <div className="relative z-10 flex shrink-0 flex-col items-center gap-1 sm:flex-row">
        {resource.canManage && onEdit && (
          <Button variant="ghost" size="icon-sm" onClick={() => onEdit(resource)} aria-label={t('action.edit')} title={t('action.edit')} className="text-muted-foreground">
            <Pencil aria-hidden="true" />
          </Button>
        )}
        <BookmarkButton resource={resource} />
        <OpenDocumentButton resource={resource} iconOnlyOnMobile />
      </div>
    </article>
  )
}

function ResourceMeta({ resource }: { resource: LibraryResourceDto }) {
  const { t } = useI18n()
  const labels = useLibraryLabels()
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
      {resource.year && (
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays className="size-3.5" aria-hidden="true" />
          {resource.year}
        </span>
      )}
      <span className="inline-flex items-center gap-1.5">
        <Languages className="size-3.5" aria-hidden="true" />
        {labels.language(resource.language)}
      </span>
      {resource.pages && (
        <span className="inline-flex items-center gap-1.5">
          <FileStack className="size-3.5" aria-hidden="true" />
          {t('library.pagesCount', { count: resource.pages })}
        </span>
      )}
    </div>
  )
}

export function ResourceTags({ tags, limit }: { tags: string[]; limit?: number }) {
  const visible = limit ? tags.slice(0, limit) : tags
  const hidden = tags.length - visible.length
  if (!tags.length) return null
  return (
    <ul className="flex flex-wrap gap-1.5">
      {visible.map((tag) => (
        <li key={tag} className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
          #{tag}
        </li>
      ))}
      {hidden > 0 && <li className="px-1 py-0.5 text-xs text-muted-foreground">+{hidden}</li>}
    </ul>
  )
}

function ResourceStats({ resource, className }: { resource: LibraryResourceDto; className?: string }) {
  const { t, formatNumber } = useI18n()
  return (
    <dl className={cn('flex items-center gap-3 text-xs text-muted-foreground tabular-nums', className)}>
      <div className="inline-flex items-center gap-1" title={t('library.stats.views')}>
        <dt>
          <Eye className="size-3.5" aria-hidden="true" />
          <span className="sr-only">{t('library.stats.views')}</span>
        </dt>
        <dd>{formatNumber(resource.viewCount)}</dd>
      </div>
      <div className="inline-flex items-center gap-1" title={t('library.stats.downloads')}>
        <dt>
          <Download className="size-3.5" aria-hidden="true" />
          <span className="sr-only">{t('library.stats.downloads')}</span>
        </dt>
        <dd>{formatNumber(resource.downloadCount)}</dd>
      </div>
    </dl>
  )
}

function OpenDocumentButton({ resource, iconOnlyOnMobile = false }: { resource: LibraryResourceDto; iconOnlyOnMobile?: boolean }) {
  const { t } = useI18n()
  const { open, pendingId } = useOpenDocument()
  const pending = pendingId === resource.id
  const label = resource.fileUrl ? t('action.open') : t('library.noFile')
  return (
    <Button
      size="sm"
      variant="soft"
      className="relative z-10"
      onClick={() => open(resource.id)}
      disabled={!resource.fileUrl || pending}
      title={label}
    >
      {pending ? <Loader2 className="animate-spin" aria-hidden="true" /> : <ExternalLink aria-hidden="true" />}
      <span className={cn(iconOnlyOnMobile && 'sr-only sm:not-sr-only')}>{t('action.open')}</span>
    </Button>
  )
}

/** Compact card for "related resources" strips. */
export function ResourceCompactCard({ resource }: { resource: LibraryResourceDto }) {
  const labels = useLibraryLabels()
  const by = byline(resource)
  return (
    <article className="group relative flex gap-3 rounded-xl border bg-card p-4 shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-elevated)]">
      <ResourceThumb type={resource.type} className="size-11" />
      <div className="min-w-0 flex-1 space-y-1">
        <p className="text-xs font-medium text-muted-foreground">
          {labels.type(resource.type)}
          {resource.year && ` · ${resource.year}`}
        </p>
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug">
          <Link href={routes.resource(resource.id)} className="after:absolute after:inset-0 after:content-[''] focus-visible:underline group-hover:text-primary">
            {resource.title}
          </Link>
        </h3>
        {by && <p className="truncate text-xs text-muted-foreground">{by}</p>}
      </div>
    </article>
  )
}
