'use client'

import { useEffect, useState, useMemo } from 'react'
import {
  api,
  formatFileSize,
  formatDate,
  type LibraryResource,
} from '@/lib/api'
import { useNav } from '@/store/auth'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  ArrowLeft,
  BookOpen,
  FileText,
  Video,
  Headphones,
  File,
  Scale,
  Star,
  Eye,
  Download,
  Calendar,
  User,
  Building2,
  Languages,
  FileBox,
  Tag,
  Loader2,
  PlayCircle,
  AlertCircle,
  ArrowRight,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useTranslation } from '@/lib/i18n'
import { cn } from '@/lib/utils'

interface DetailResponse {
  status: string
  data: LibraryResource & {
    uploader?: {
      id: string
      firstName: string
      lastName: string
    } | null
  }
}

interface RelatedResponse {
  status: string
  data: LibraryResource[]
}

const TYPE_COLORS: Record<string, string> = {
  book: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 border-teal-200 dark:border-teal-800',
  article: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
  video: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800',
  audio: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800',
  document: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  normative: 'bg-slate-200 text-slate-700 dark:bg-slate-800/50 dark:text-slate-300 border-slate-300 dark:border-slate-700',
}

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

export function LibraryDetailView() {
  const navigate = useNav((s) => s.navigate)
  const params = useNav((s) => s.params)
  const id = params.id
  const { toast } = useToast()
  const { t } = useTranslation()

  const [resource, setResource] = useState<
    (LibraryResource & {
      uploader?: { id: string; firstName: string; lastName: string } | null
    }) | null
  >(null)
  const [related, setRelated] = useState<LibraryResource[]>([])
  const [loading, setLoading] = useState(true)
  const [relatedLoading, setRelatedLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)
  const [bookmarkToggling, setBookmarkToggling] = useState(false)

  const typeLabel = (typeKey: string) => t(`library.type.${typeKey}`)
  const languageLabel = (langKey: string) => t(`library.language.${langKey}`)

  // Fetch resource detail
  useEffect(() => {
    if (!id) return
    let cancelled = false
    Promise.resolve().then(() => {
      if (!cancelled) setLoading(true)
    })
    api
      .get<DetailResponse>(`/library/${id}`)
      .then((r) => {
        if (cancelled) return
        setResource(r.data)
      })
      .catch((e) => {
        if (cancelled) return
        toast({
          title: t('common.error'),
          description: e instanceof Error ? e.message : t('library.loadFailed'),
          variant: 'destructive',
        })
        setResource(null)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  // Fetch related resources (same category, take 4, exclude current)
  useEffect(() => {
    if (!resource?.category) {
      setRelated([])
      setRelatedLoading(false)
      return
    }
    let cancelled = false
    setRelatedLoading(true)
    const p = new URLSearchParams()
    p.set('limit', '5')
    p.set('category', resource.category)
    p.set('sort', 'popular')
    api
      .get<RelatedResponse>(`/library?${p.toString()}`)
      .then((r) => {
        if (cancelled) return
        const filtered = (r.data ?? []).filter((x) => x.id !== resource.id).slice(0, 4)
        setRelated(filtered)
      })
      .catch(() => {
        if (!cancelled) setRelated([])
      })
      .finally(() => {
        if (!cancelled) setRelatedLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [resource?.id, resource?.category])

  const tags = useMemo(() => {
    if (!resource?.tags) return []
    return resource.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
  }, [resource?.tags])

  const handleDownload = async () => {
    if (!resource) return
    setDownloading(true)
    try {
      const res = await api.post<{
        data: { fileUrl: string; downloadCount: number }
      }>(`/library/${resource.id}/download`)
      // Update local state with new download count
      setResource((prev) =>
        prev
          ? { ...prev, downloadCount: res.data.downloadCount ?? prev.downloadCount }
          : prev
      )
      toast({
        title: t('library.downloaded'),
        description: t('library.downloadedDesc'),
      })
      // In real app: window.location = res.data.fileUrl
      // For demo we just show the toast since fileUrl is '#'
      if (res.data.fileUrl && res.data.fileUrl !== '#') {
        window.open(res.data.fileUrl, '_blank', 'noopener,noreferrer')
      }
    } catch (e) {
      toast({
        title: t('common.error'),
        description: e instanceof Error ? e.message : t('library.downloadFailed'),
        variant: 'destructive',
      })
    } finally {
      setDownloading(false)
    }
  }

  const handleToggleBookmark = async () => {
    if (!resource) return
    const currentState = !!resource.bookmarked
    // Optimistic update
    setResource((prev) =>
      prev ? { ...prev, bookmarked: !currentState } : prev
    )
    setBookmarkToggling(true)
    try {
      await api.post(`/library/${resource.id}/bookmark`)
      toast({
        title: currentState
          ? t('library.bookmarkRemoved')
          : t('library.bookmarkAdded'),
        description: currentState
          ? t('library.bookmarkRemovedDesc')
          : t('library.bookmarkAddedDesc'),
      })
    } catch (e) {
      // Revert on error
      setResource((prev) =>
        prev ? { ...prev, bookmarked: currentState } : prev
      )
      toast({
        title: t('common.error'),
        description: e instanceof Error ? e.message : t('common.actionFailed'),
        variant: 'destructive',
      })
    } finally {
      setBookmarkToggling(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-9 w-32" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-72 w-full rounded-xl" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  if (!resource) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => navigate('library')} size="sm">
          <ArrowLeft className="w-4 h-4" /> {t('library.backToLibrary')}
        </Button>
        <Card className="p-12">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{t('library.resourceNotFound')}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {t('library.resourceNotFoundDesc')}
              </p>
            </div>
            <Button onClick={() => navigate('library')}>
              <ArrowLeft className="w-4 h-4" /> {t('library.backToLibrary')}
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  const isBookmarked = !!resource.bookmarked

  return (
    <div className="space-y-4">
      {/* Back button */}
      <Button variant="ghost" onClick={() => navigate('library')} size="sm">
        <ArrowLeft className="w-4 h-4" /> {t('library.backToLibrary')}
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-4">
          {/* Header card with cover + title */}
          <Card className="overflow-hidden pt-0 gap-0">
            <div className="relative aspect-[16/7] overflow-hidden bg-muted">
              {resource.coverUrl ? (
                <img
                  src={resource.coverUrl}
                  alt={resource.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                  <ResourceTypeIcon
                    type={resource.type}
                    className="w-20 h-20 text-primary/40"
                  />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 flex-wrap">
                <div className="flex flex-wrap gap-2">
                  <span
                    className={cn(
                      'text-xs font-medium px-2.5 py-1 rounded-full border bg-white/95 backdrop-blur',
                      TYPE_COLORS[resource.type] ?? ''
                    )}
                  >
                    {typeLabel(resource.type) ?? resource.type}
                  </span>
                  {resource.category && (
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/95 backdrop-blur text-foreground border">
                      {resource.category}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <CardContent className="p-6 space-y-4">
              <h1 className="text-2xl md:text-3xl font-bold leading-tight">
                {resource.title}
              </h1>

              {resource.author && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="w-4 h-4" />
                  <span>{t('library.author')}: <span className="text-foreground font-medium">{resource.author}</span></span>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2 pt-2">
                <Button onClick={handleDownload} disabled={downloading}>
                  {downloading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  {t('common.download')}
                </Button>
                <Button
                  variant={isBookmarked ? 'default' : 'outline'}
                  onClick={handleToggleBookmark}
                  disabled={bookmarkToggling}
                >
                  {bookmarkToggling ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Star className={cn('w-4 h-4', isBookmarked && 'fill-current')} />
                  )}
                  {isBookmarked
                    ? t('common.removeBookmark')
                    : t('common.addBookmark')}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('library.description')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {resource.description ?? t('library.noDescription')}
              </p>

              {tags.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
                    <Tag className="w-3.5 h-3.5" /> {t('library.tags')}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map((t, i) => (
                      <Badge key={`${t}-${i}`} variant="secondary" className="text-xs">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('library.resourceInfo')}</CardTitle>
              <CardDescription>{t('library.resourceInfoDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <MetaItem
                icon={<Building2 className="w-4 h-4" />}
                label={t('library.publisher')}
                value={resource.publisher}
              />
              <MetaItem
                icon={<Calendar className="w-4 h-4" />}
                label={t('library.publicationYear')}
                value={resource.year ? String(resource.year) : null}
              />
              <MetaItem
                icon={<Languages className="w-4 h-4" />}
                label={t('library.language')}
                value={resource.language ? languageLabel(resource.language) ?? resource.language : null}
              />
              <MetaItem
                icon={<FileText className="w-4 h-4" />}
                label={t('library.pages')}
                value={resource.pages ? String(resource.pages) : null}
              />
              <MetaItem
                icon={<FileBox className="w-4 h-4" />}
                label={t('library.fileFormat')}
                value={resource.fileType?.toUpperCase() ?? null}
              />
              <MetaItem
                icon={<File className="w-4 h-4" />}
                label={t('library.fileSize')}
                value={resource.fileSize ? formatFileSize(resource.fileSize) : null}
              />
              {resource.uploader && (
                <MetaItem
                  icon={<User className="w-4 h-4" />}
                  label={t('library.uploadedBy')}
                  value={`${resource.uploader.firstName} ${resource.uploader.lastName}`}
                />
              )}
              <MetaItem
                icon={<Calendar className="w-4 h-4" />}
                label={t('library.addedDate')}
                value={formatDate(resource.createdAt)}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Inline viewer */}
          <Card className="overflow-hidden pt-0 gap-0">
            <div className="px-4 py-3 border-b bg-muted/30">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <PlayCircle className="w-4 h-4 text-primary" />
                {t('library.viewer')}
              </h3>
            </div>
            <CardContent className="p-4">
              <ResourceViewer resource={resource} onDownload={handleDownload} downloading={downloading} />
            </CardContent>
          </Card>

          {/* Stats card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('library.statistics')}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <StatBlock
                icon={<Eye className="w-5 h-5" />}
                label={t('library.views')}
                value={resource.viewCount}
              />
              <StatBlock
                icon={<Download className="w-5 h-5" />}
                label={t('library.downloads')}
                value={resource.downloadCount}
              />
            </CardContent>
          </Card>

          {/* Related resources */}
          <Card className="overflow-hidden pt-0 gap-0">
            <div className="px-4 py-3 border-b bg-muted/30">
              <h3 className="font-semibold text-sm">{t('library.relatedResources')}</h3>
              <p className="text-xs text-muted-foreground">
                {resource.category ? `${t('common.category')}: ${resource.category}` : ''}
              </p>
            </div>
            <CardContent className="p-2">
              {relatedLoading ? (
                <div className="space-y-2 p-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : related.length === 0 ? (
                <div className="p-4 text-center text-xs text-muted-foreground">
                  {t('library.noRelated')}
                </div>
              ) : (
                <div className="space-y-1 max-h-96 overflow-y-auto">
                  {related.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => navigate('library-detail', { id: r.id })}
                      className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors text-left"
                    >
                      <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                        <ResourceTypeIcon
                          type={r.type}
                          className="w-5 h-5 text-primary/70"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-1">{r.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {r.author ?? '—'} {r.year ? `· ${r.year}` : ''}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function MetaItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string | null | undefined
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center text-muted-foreground flex-shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium truncate">
          {value || '—'}
        </p>
      </div>
    </div>
  )
}

function StatBlock({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: number
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-3 rounded-lg bg-muted/40">
      <div className="text-primary mb-1">{icon}</div>
      <p className="text-xl font-bold">{value.toLocaleString()}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  )
}

// Inline viewer: renders appropriate UI based on resource type
function ResourceViewer({
  resource,
  onDownload,
  downloading,
}: {
  resource: LibraryResource
  onDownload: () => void
  downloading: boolean
}) {
  const { t } = useTranslation()
  const url = resource.fileUrl && resource.fileUrl !== '#' ? resource.fileUrl : null

  if (resource.type === 'video') {
    return (
      <div className="space-y-3">
        {url ? (
          <video
            controls
            className="w-full rounded-md bg-black aspect-video"
            src={url}
            poster={resource.coverUrl ?? undefined}
          >
            {t('library.videoNotSupported')}
          </video>
        ) : (
          <div className="aspect-video w-full rounded-md bg-gradient-to-br from-rose-500/10 to-rose-500/5 flex flex-col items-center justify-center gap-2 text-center p-4">
            <Video className="w-10 h-10 text-rose-500/60" />
            <p className="text-xs text-muted-foreground max-w-[220px]">
              {t('library.viewerPlaceholder')}
            </p>
          </div>
        )}
        {!url && (
          <Button size="sm" className="w-full" onClick={onDownload} disabled={downloading}>
            {downloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            {t('common.download')}
          </Button>
        )}
      </div>
    )
  }

  if (resource.type === 'audio') {
    return (
      <div className="space-y-3">
        <div className="aspect-square w-full max-w-[200px] mx-auto rounded-md bg-gradient-to-br from-purple-500/10 to-purple-500/5 flex items-center justify-center">
          <Headphones className="w-12 h-12 text-purple-500/60" />
        </div>
        {url ? (
          <audio controls className="w-full" src={url}>
            {t('library.audioNotSupported')}
          </audio>
        ) : (
          <p className="text-xs text-muted-foreground text-center">
            {t('library.audioViewerPlaceholder')}
          </p>
        )}
        {!url && (
          <Button size="sm" variant="outline" className="w-full" onClick={onDownload} disabled={downloading}>
            {downloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            {t('common.download')}
          </Button>
        )}
      </div>
    )
  }

  // PDF / document / book / article / normative — styled placeholder card
  return (
    <div className="space-y-3">
      <div className="aspect-[3/4] w-full max-w-[220px] mx-auto rounded-md bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-dashed border-primary/20 flex flex-col items-center justify-center gap-3 p-4 text-center">
        <ResourceTypeIcon type={resource.type} className="w-12 h-12 text-primary/60" />
        <div>
          <p className="text-sm font-medium">{t('library.viewer')}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {resource.fileType?.toUpperCase() ?? 'PDF'} ·{' '}
            {formatFileSize(resource.fileSize || 0)}
          </p>
        </div>
        <p className="text-xs text-muted-foreground max-w-[180px]">
          {t('library.useDownloadButton')}
        </p>
      </div>
      <Button size="sm" className="w-full" onClick={onDownload} disabled={downloading}>
        {downloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
        {t('common.download')} ({formatFileSize(resource.fileSize || 0)})
      </Button>
    </div>
  )
}
