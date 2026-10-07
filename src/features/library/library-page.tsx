'use client'

import { useState } from 'react'
import { Archive, Bookmark, LayoutGrid, Library, List, Plus } from 'lucide-react'
import { CardGridSkeleton } from '@/components/shared/page-loader'
import { EmptyState } from '@/components/shared/empty-state'
import { ErrorState } from '@/components/shared/error-state'
import { FilterSelect } from '@/components/shared/filter-select'
import { PageHeader } from '@/components/shared/page-header'
import { PaginationBar } from '@/components/shared/pagination-bar'
import { SearchInput } from '@/components/shared/search-input'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useSession } from '@/features/auth/session'
import { useUrlState } from '@/hooks/use-url-state'
import { useI18n } from '@/i18n/provider'
import type { LibraryResourceDto } from '@/shared/dto'
import { PERMISSIONS } from '@/shared/roles'
import { useLibrary, useLibraryFacets, type LibraryListParams, type LibrarySort } from './api'
import { ResourceCard, ResourceRow } from './components/resource-card'
import { ResourceFormDialog } from './components/resource-form-dialog'
import { useLibraryLabels } from './labels'
import { useViewMode, type ViewMode } from './use-view-mode'

const PAGE_SIZE = 12
const FILTER_KEYS = { q: '', type: '', category: '', language: '', year: '' }

export function LibraryPage() {
  const { t } = useI18n()
  const session = useSession()
  const canManage = session.can(PERMISSIONS.LIBRARY_MANAGE)
  const labels = useLibraryLabels()
  const [filters, setFilters] = useUrlState({ ...FILTER_KEYS, shelf: 'all', sort: 'newest', page: '1' })
  const [view, setView] = useViewMode()
  const [dialog, setDialog] = useState<{ open: boolean; resource: LibraryResourceDto | null }>({ open: false, resource: null })
  const facets = useLibraryFacets()

  const shelf = filters.shelf === 'archived' && !canManage ? 'all' : filters.shelf
  const params: LibraryListParams = {
    search: filters.q || undefined,
    type: filters.type || undefined,
    category: filters.category || undefined,
    language: filters.language || undefined,
    year: filters.year || undefined,
    bookmarked: shelf === 'saved' || undefined,
    status: shelf === 'archived' ? 'archived' : undefined,
    sort: filters.sort as LibrarySort,
    page: Number(filters.page) || 1,
    limit: PAGE_SIZE,
  }
  const library = useLibrary(params)
  const filtered = Boolean(filters.q || filters.type || filters.category || filters.language || filters.year)

  const openEditor = (resource: LibraryResourceDto | null) => setDialog({ open: true, resource })
  const shelves = [
    { value: 'all', label: t('library.shelf.all'), icon: Library },
    { value: 'saved', label: t('library.shelf.saved'), icon: Bookmark },
    ...(canManage ? [{ value: 'archived', label: t('library.shelf.archived'), icon: Archive }] : []),
  ]

  return (
    <div>
      <PageHeader
        title={t('library.title')}
        description={t('library.description')}
        actions={
          canManage && (
            <Button onClick={() => openEditor(null)}>
              <Plus aria-hidden="true" />
              {t('library.add')}
            </Button>
          )
        }
      />

      <div className="mb-6 space-y-4">
        <Tabs value={shelf} onValueChange={(value) => setFilters({ shelf: value })}>
          <TabsList>
            {shelves.map(({ value, label, icon: Icon }) => (
              <TabsTrigger key={value} value={value} className="gap-1.5">
                <Icon className="size-4" aria-hidden="true" />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchInput value={filters.q} onChange={(q) => setFilters({ q })} placeholder={t('library.search')} className="sm:flex-1 lg:max-w-md" />
          <div className="flex items-center gap-3 sm:ml-auto">
            <FilterSelect
              value={filters.sort}
              onChange={(sort) => setFilters({ sort })}
              ariaLabel={t('common.sortBy')}
              className="flex-1 sm:w-52 sm:flex-none"
              options={[
                { value: 'newest', label: t('common.sort.newest') },
                { value: 'popular', label: t('library.sort.popular') },
                { value: 'downloads', label: t('library.sort.downloads') },
                { value: 'title', label: t('common.sort.title') },
                { value: 'year', label: t('library.sort.year') },
              ]}
            />
            <ToggleGroup
              type="single"
              variant="outline"
              value={view}
              onValueChange={(value) => value && setView(value as ViewMode)}
              aria-label={t('library.view.label')}
              className="h-10 shrink-0 bg-card"
            >
              <ToggleGroupItem value="grid" aria-label={t('library.view.grid')} title={t('library.view.grid')} className="size-10">
                <LayoutGrid aria-hidden="true" />
              </ToggleGroupItem>
              <ToggleGroupItem value="list" aria-label={t('library.view.list')} title={t('library.view.list')} className="size-10">
                <List aria-hidden="true" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:flex lg:flex-wrap lg:items-center">
          <FilterSelect
            value={filters.type}
            onChange={(type) => setFilters({ type })}
            allLabel={t('library.filter.allTypes')}
            ariaLabel={t('common.type')}
            options={(facets.data?.types ?? []).map((option) => ({ value: option.value, label: `${labels.type(option.value)} (${option.count})` }))}
            className="sm:w-full lg:w-48"
          />
          <FilterSelect
            value={filters.category}
            onChange={(category) => setFilters({ category })}
            allLabel={t('library.filter.allCategories')}
            ariaLabel={t('common.category')}
            options={(facets.data?.categories ?? []).map((option) => ({ value: option.value, label: `${option.value} (${option.count})` }))}
            className="sm:w-full lg:w-64"
          />
          <FilterSelect
            value={filters.language}
            onChange={(language) => setFilters({ language })}
            allLabel={t('library.filter.allLanguages')}
            ariaLabel={t('common.language')}
            options={(facets.data?.languages ?? []).map((option) => ({ value: option.value, label: `${labels.language(option.value)} (${option.count})` }))}
            className="sm:w-full lg:w-48"
          />
          <FilterSelect
            value={filters.year}
            onChange={(year) => setFilters({ year })}
            allLabel={t('library.filter.allYears')}
            ariaLabel={t('common.year')}
            options={(facets.data?.years ?? []).map((year) => ({ value: String(year), label: String(year) }))}
            className="sm:w-full lg:w-36"
          />
          {filtered && (
            <Button variant="ghost" className="col-span-2 h-10 justify-self-start text-muted-foreground sm:col-span-4 lg:col-span-1" onClick={() => setFilters(FILTER_KEYS)}>
              {t('action.reset')}
            </Button>
          )}
        </div>
      </div>

      {library.isPending ? (
        view === 'grid' ? <CardGridSkeleton className="h-96" /> : <ListSkeleton />
      ) : library.isError ? (
        <ErrorState error={library.error} onRetry={() => library.refetch()} />
      ) : library.data.items.length === 0 ? (
        <LibraryEmpty shelf={shelf} filtered={filtered} onReset={() => setFilters(FILTER_KEYS)} />
      ) : (
        <>
          {view === 'grid' ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3" aria-busy={library.isFetching}>
              {library.data.items.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} onEdit={openEditor} />
              ))}
            </div>
          ) : (
            <div className="divide-y overflow-hidden rounded-xl border bg-card shadow-[var(--shadow-card)]" aria-busy={library.isFetching}>
              {library.data.items.map((resource) => (
                <ResourceRow key={resource.id} resource={resource} onEdit={openEditor} />
              ))}
            </div>
          )}
          <PaginationBar meta={library.data.meta} onPageChange={(page) => setFilters({ page })} />
        </>
      )}

      {canManage && <ResourceFormDialog open={dialog.open} onOpenChange={(open) => setDialog((current) => ({ ...current, open }))} resource={dialog.resource} />}
    </div>
  )
}

function LibraryEmpty({ shelf, filtered, onReset }: { shelf: string; filtered: boolean; onReset: () => void }) {
  const { t } = useI18n()
  if (filtered) {
    return (
      <EmptyState
        icon={Library}
        title={t('state.noResults')}
        description={t('state.noResultsHint')}
        action={
          <Button variant="outline" onClick={onReset}>
            {t('action.reset')}
          </Button>
        }
      />
    )
  }
  if (shelf === 'saved') return <EmptyState icon={Bookmark} title={t('library.empty.saved')} description={t('library.empty.savedHint')} />
  if (shelf === 'archived') return <EmptyState icon={Archive} title={t('library.empty.archived')} description={t('library.empty.archivedHint')} />
  return <EmptyState icon={Library} title={t('library.empty.all')} description={t('library.empty.allHint')} />
}

function ListSkeleton() {
  return (
    <div className="divide-y rounded-xl border bg-card" aria-busy="true">
      {Array.from({ length: 6 }, (_, index) => (
        <div key={index} className="flex items-center gap-4 p-4 sm:px-5">
          <Skeleton className="hidden size-12 rounded-lg sm:block" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-8 w-20" />
        </div>
      ))}
    </div>
  )
}
