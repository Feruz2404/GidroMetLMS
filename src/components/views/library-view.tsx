'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'
import { api, formatFileSize, type LibraryResource } from '@/lib/api'
import { useAuth, useNav } from '@/store/auth'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Search,
  BookOpen,
  FileText,
  Video,
  Headphones,
  File,
  Scale,
  Library as LibraryIcon,
  Plus,
  Filter,
  Star,
  Eye,
  Download,
  X,
  AlertCircle,
  ArrowRight,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useTranslation } from '@/lib/i18n'
import { cn } from '@/lib/utils'

interface LibraryResponse {
  status: string
  data: LibraryResource[]
  meta?: { total: number; page: number; pages: number; limit: number }
}

const TYPE_COLORS: Record<string, string> = {
  book: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 border-teal-200 dark:border-teal-800',
  article: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
  video: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800',
  audio: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800',
  document: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  normative: 'bg-slate-200 text-slate-700 dark:bg-slate-800/50 dark:text-slate-300 border-slate-300 dark:border-slate-700',
}

const RESOURCE_TYPES = ['book', 'article', 'video', 'audio', 'document', 'normative']

const PAGE_SIZE = 12

// Module-level icon component (avoids react-hooks static-components error)
function ResourceTypeIcon({ type, className }: { type: string; className?: string }) {
  switch (type) {
    case 'book': return <BookOpen className={className} />
    case 'article': return <FileText className={className} />
    case 'video': return <Video className={className} />
    case 'audio': return <Headphones className={className} />
    case 'normative': return <Scale className={className} />
    case 'document': return <File className={className} />
    default: return <FileText className={className} />
  }
}

export function LibraryView() {
  const user = useAuth((s) => s.user)!
  const navigate = useNav((s) => s.navigate)
  const { toast } = useToast()
  const { t } = useTranslation()

  const [resources, setResources] = useState<LibraryResource[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [meta, setMeta] = useState<{ total: number; pages: number }>({ total: 0, pages: 1 })

  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [type, setType] = useState<string>('all')
  const [category, setCategory] = useState<string>('all')
  const [year, setYear] = useState<string>('all')
  const [sort, setSort] = useState<string>('newest')
  const [bookmarksOnly, setBookmarksOnly] = useState(false)

  const [categories, setCategories] = useState<string[]>([])
  const [years, setYears] = useState<number[]>([])

  const typeLabel = useCallback(
    (typeKey: string) => t(`library.type.${typeKey}`),
    [t]
  )

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 350)
    return () => clearTimeout(t)
  }, [search])

  // Build query string
  const queryString = useMemo(() => {
    const p = new URLSearchParams()
    p.set('page', String(page))
    p.set('limit', String(PAGE_SIZE))
    p.set('sort', sort)
    if (debouncedSearch) p.set('search', debouncedSearch)
    if (type !== 'all') p.set('type', type)
    if (category !== 'all') p.set('category', category)
    if (year !== 'all') p.set('year', year)
    if (bookmarksOnly) p.set('bookmarks', 'true')
    return p.toString()
  }, [page, sort, debouncedSearch, type, category, year, bookmarksOnly])

  useEffect(() => {
    let cancelled = false
    Promise.resolve().then(() => {
      if (!cancelled) setLoading(true)
    })
    api
      .get<LibraryResponse>(`/library?${queryString}`)
      .then((r) => {
        if (cancelled) return
        setResources(r.data ?? [])
        if (r.meta) setMeta({ total: r.meta.total, pages: r.meta.pages })

        // Extract unique categories + years from results for filter dropdowns
        // (only when not actively filtered — to keep options stable)
        if (category === 'all' && year === 'all' && !debouncedSearch && !bookmarksOnly && type === 'all' && page === 1) {
          const cats = new Set<string>()
          const yrs = new Set<number>()
          for (const r2 of r.data ?? []) {
            if (r2.category) cats.add(r2.category)
            if (r2.year) yrs.add(r2.year)
          }
          setCategories(Array.from(cats).sort())
          setYears(Array.from(yrs).sort((a, b) => b - a))
        }
      })
      .catch((e) => {
        if (cancelled) return
        toast({
          title: t('common.error'),
          description: (e as Error).message || t('library.loadFailed'),
          variant: 'destructive',
        })
        setResources([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryString])

  const toggleBookmark = useCallback(
    async (e: React.MouseEvent, resourceId: string, currentState: boolean) => {
      e.stopPropagation()
      // Optimistic update
      setResources((prev) =>
        prev.map((r) =>
          r.id === resourceId ? { ...r, bookmarked: !currentState } : r
        )
      )
      try {
        await api.post<{ data: { bookmarked: boolean } }>(`/library/${resourceId}/bookmark`)
        toast({
          title: currentState ? t('library.bookmarkRemoved') : t('library.bookmarkAdded'),
          description: currentState
            ? t('library.bookmarkRemovedDesc')
            : t('library.bookmarkAddedDesc'),
        })
      } catch (e) {
        // Revert on error
        setResources((prev) =>
          prev.map((r) =>
            r.id === resourceId ? { ...r, bookmarked: currentState } : r
          )
        )
        toast({
          title: t('common.error'),
          description: e instanceof Error ? e.message : t('common.actionFailed'),
          variant: 'destructive',
        })
      }
    },
    [toast, t]
  )

  const handleCreate = () => {
    toast({
      title: t('common.comingSoon'),
      description: t('library.uploadComingSoon'),
    })
  }

  const clearFilters = () => {
    setSearch('')
    setType('all')
    setCategory('all')
    setYear('all')
    setSort('newest')
    setBookmarksOnly(false)
    setPage(1)
  }

  const hasActiveFilters =
    !!debouncedSearch ||
    type !== 'all' ||
    category !== 'all' ||
    year !== 'all' ||
    bookmarksOnly

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <LibraryIcon className="w-6 h-6 text-primary" />
            {t('library.title')}
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {t('library.subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={bookmarksOnly ? 'default' : 'outline'}
            onClick={() => {
              setBookmarksOnly((v) => !v)
              setPage(1)
            }}
          >
            <Star className={cn('w-4 h-4', bookmarksOnly && 'fill-current')} />
            {t('common.myBookmarks')}
          </Button>
          {(user.role === 'tutor' || user.role === 'admin') && (
            <Button onClick={handleCreate}>
              <Plus className="w-4 h-4" /> {t('library.newResource')}
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t('library.searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-accent"
                aria-label={t('common.clearSearch')}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <Select value={type} onValueChange={(v) => { setType(v); setPage(1) }}>
              <SelectTrigger className="w-[150px]">
                <Filter className="w-4 h-4 mr-1 text-muted-foreground" />
                <SelectValue placeholder={t('common.type')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common.allTypes')}</SelectItem>
                {RESOURCE_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {typeLabel(t)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={category} onValueChange={(v) => { setCategory(v); setPage(1) }}>
              <SelectTrigger className="w-[170px]">
                <SelectValue placeholder={t('common.category')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common.allCategories')}</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={year} onValueChange={(v) => { setYear(v); setPage(1) }}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder={t('library.year')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common.allYears')}</SelectItem>
                {years.map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sort} onValueChange={(v) => { setSort(v); setPage(1) }}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">{t('common.newest')}</SelectItem>
                <SelectItem value="popular">{t('library.mostViewed')}</SelectItem>
                <SelectItem value="downloads">{t('library.mostDownloaded')}</SelectItem>
                <SelectItem value="title">{t('library.sortTitle')}</SelectItem>
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button variant="ghost" onClick={clearFilters} size="sm">
                <X className="w-4 h-4" /> {t('common.clear')}
              </Button>
            )}
          </div>
        </div>

        {/* Result count */}
        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {loading
              ? t('common.loading')
              : t('library.resultsFound').replace('{total}', String(meta.total))}
          </span>
          {bookmarksOnly && (
            <span className="flex items-center gap-1 text-primary">
              <Star className="w-3.5 h-3.5 fill-current" />
              {t('library.bookmarkedResources')}
            </span>
          )}
        </div>
      </Card>

      {/* Resource grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="overflow-hidden pt-0 gap-0">
              <Skeleton className="h-44 w-full rounded-none" />
              <CardContent className="pt-4 space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                </div>
                <Skeleton className="h-8 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : resources.length === 0 ? (
        <Card className="p-12">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">
                {bookmarksOnly ? t('library.noBookmarks') : t('library.noResources')}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {bookmarksOnly
                  ? t('library.noBookmarksDesc')
                  : hasActiveFilters
                    ? t('common.tryChangingFilters')
                    : t('library.noResourcesYet')}
              </p>
            </div>
            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters}>
                {t('common.clearFilters')}
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {resources.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              onOpen={() => navigate('library-detail', { id: resource.id })}
              onToggleBookmark={(e) =>
                toggleBookmark(e, resource.id, !!resource.bookmarked)
              }
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && meta.pages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            {t('common.prev')}
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, meta.pages) }).map((_, i) => {
              const startPage = Math.max(1, Math.min(page - 2, meta.pages - 4))
              const pageNum = startPage + i
              if (pageNum > meta.pages) return null
              return (
                <Button
                  key={pageNum}
                  variant={page === pageNum ? 'default' : 'outline'}
                  size="sm"
                  className="w-9 h-9 p-0"
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum}
                </Button>
              )
            })}
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= meta.pages}
            onClick={() => setPage((p) => Math.min(meta.pages, p + 1))}
          >
            {t('common.next')}
          </Button>
        </div>
      )}
    </div>
  )
}

function ResourceCard({
  resource,
  onOpen,
  onToggleBookmark,
}: {
  resource: LibraryResource
  onOpen: () => void
  onToggleBookmark: (e: React.MouseEvent) => void
}) {
  const { t } = useTranslation()
  const isBookmarked = !!resource.bookmarked
  const fileTypeLabel = resource.fileType?.toUpperCase() ?? '—'

  const typeLabel = (typeKey: string) => t(`library.type.${typeKey}`)

  return (
    <Card
      className="overflow-hidden cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5 group pt-0 gap-0"
      onClick={onOpen}
    >
      {/* Cover / icon header */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {resource.coverUrl ? (
          <img
            src={resource.coverUrl}
            alt={resource.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/15 to-primary/5">
            <ResourceTypeIcon
              type={resource.type}
              className="w-12 h-12 text-primary/60"
            />
          </div>
        )}

        {/* Top-left: type badge */}
        <div className="absolute top-2 left-2">
          <span
            className={cn(
              'text-[10px] font-medium px-2 py-0.5 rounded-full border backdrop-blur-sm bg-white/95',
              TYPE_COLORS[resource.type] ?? ''
            )}
          >
            {typeLabel(resource.type) ?? resource.type}
          </span>
        </div>

        {/* Top-right: bookmark toggle */}
        <button
          onClick={onToggleBookmark}
          aria-label={isBookmarked ? t('common.removeBookmark') : t('common.addBookmark')}
          className={cn(
            'absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all backdrop-blur-sm',
            isBookmarked
              ? 'bg-amber-400 text-white hover:bg-amber-500'
              : 'bg-white/90 text-muted-foreground hover:bg-white hover:text-amber-500'
          )}
        >
          <Star className={cn('w-4 h-4', isBookmarked && 'fill-current')} />
        </button>

        {/* Bottom: file format */}
        <div className="absolute bottom-2 left-2">
          <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-black/60 text-white backdrop-blur-sm">
            {fileTypeLabel}
          </span>
        </div>
      </div>

      <CardContent className="p-4 space-y-2">
        <h3 className="font-semibold line-clamp-2 leading-snug min-h-[2.5rem]">
          {resource.title}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-2 min-h-[2rem]">
          {resource.description ?? t('library.noDescription')}
        </p>

        {/* Author / year */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {resource.author && (
            <span className="truncate flex-1 min-w-0">{resource.author}</span>
          )}
          {resource.year && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5">
              {resource.year}
            </Badge>
          )}
        </div>

        {/* Category */}
        {resource.category && (
          <Badge variant="secondary" className="text-[10px]">
            {resource.category}
          </Badge>
        )}

        {/* File + stats meta */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
          <span className="flex items-center gap-1" title={t('library.fileSize')}>
            <File className="w-3.5 h-3.5" />
            {formatFileSize(resource.fileSize || 0)}
          </span>
          <span className="flex items-center gap-1" title={t('library.views')}>
            <Eye className="w-3.5 h-3.5" />
            {resource.viewCount}
          </span>
          <span className="flex items-center gap-1" title={t('library.downloads')}>
            <Download className="w-3.5 h-3.5" />
            {resource.downloadCount}
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button size="sm" className="w-full" variant="outline">
          {t('common.detail')} <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </CardFooter>
    </Card>
  )
}
