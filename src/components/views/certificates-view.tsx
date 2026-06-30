'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'
import { api, formatDate, type Certificate } from '@/lib/api'
import { useAuth, useNav } from '@/store/auth'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Award,
  Search,
  Eye,
  Download,
  X,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  Calendar,
  Hash,
  TrendingUp,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useTranslation } from '@/lib/i18n'

interface CertificatesResponse {
  status: string
  data: Certificate[]
  meta?: { total: number; page: number; pages: number; limit: number }
}

interface AutoGenResponse {
  status: string
  data: {
    created: number
    certificates: Array<{ certNumber: string; studentName: string; courseTitle: string }>
    message: string
  }
}

const PAGE_SIZE = 12

export function CertificatesView() {
  const user = useAuth((s) => s.user)!
  const navigate = useNav((s) => s.navigate)
  const { toast } = useToast()
  const { t } = useTranslation()

  const isStaff = user.role === 'tutor' || user.role === 'admin'

  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [meta, setMeta] = useState<{ total: number; pages: number }>({ total: 0, pages: 1 })

  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [courseId, setCourseId] = useState<string>('all')
  const [status, setStatus] = useState<string>('all')
  const [courses, setCourses] = useState<Array<{ id: string; title: string }>>([])

  const [autoGenerating, setAutoGenerating] = useState(false)
  const [revokingId, setRevokingId] = useState<string | null>(null)
  const [revokeDialog, setRevokeDialog] = useState<{ open: boolean; cert: Certificate | null }>({
    open: false,
    cert: null,
  })

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
    if (isStaff && debouncedSearch) p.set('search', debouncedSearch)
    if (isStaff && courseId !== 'all') p.set('courseId', courseId)
    if (isStaff && status !== 'all') p.set('status', status)
    return p.toString()
  }, [page, isStaff, debouncedSearch, courseId, status])

  // Fetch certificates
  useEffect(() => {
    let cancelled = false
    Promise.resolve().then(() => {
      if (!cancelled) setLoading(true)
    })
    api
      .get<CertificatesResponse>(`/certificates?${queryString}`)
      .then((r) => {
        if (cancelled) return
        setCertificates(r.data ?? [])
        if (r.meta) setMeta({ total: r.meta.total, pages: r.meta.pages })
      })
      .catch((e) => {
        if (cancelled) return
        toast({
          title: t('common.error'),
          description: (e as Error).message || t('certificates.loadFailed'),
          variant: 'destructive',
        })
        setCertificates([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [queryString, toast, t])

  // Fetch course list for filter (staff only, once)
  useEffect(() => {
    if (!isStaff) return
    let cancelled = false
    api
      .get<{ status: string; data: Array<{ id: string; title: string }> }>(
        '/courses?limit=60&sort=title'
      )
      .then((r) => {
        if (cancelled) return
        setCourses(r.data ?? [])
      })
      .catch(() => {
        if (!cancelled) setCourses([])
      })
    return () => {
      cancelled = true
    }
  }, [isStaff])

  const clearFilters = () => {
    setSearch('')
    setCourseId('all')
    setStatus('all')
    setPage(1)
  }

  const hasActiveFilters =
    !!debouncedSearch || courseId !== 'all' || status !== 'all'

  const handleAutoGenerate = useCallback(async () => {
    setAutoGenerating(true)
    try {
      const res = await api.post<AutoGenResponse>('/certificates/auto')
      toast({
        title: res.data.created > 0 ? t('certificates.certsCreated') : t('certificates.noNewCerts'),
        description: res.data.message,
        variant: res.data.created > 0 ? 'default' : 'default',
      })
      // Refresh list
      if (res.data.created > 0) {
        setPage(1)
        // Re-fetch by toggling queryString via state change
        setTimeout(() => {
          api
            .get<CertificatesResponse>(`/certificates?${queryString}`)
            .then((r) => {
              setCertificates(r.data ?? [])
              if (r.meta) setMeta({ total: r.meta.total, pages: r.meta.pages })
            })
            .catch(() => {})
        }, 200)
      }
    } catch (e) {
      toast({
        title: t('common.error'),
        description: e instanceof Error ? e.message : t('certificates.autoFailed'),
        variant: 'destructive',
      })
    } finally {
      setAutoGenerating(false)
    }
  }, [queryString, toast, t])

  const handleRevoke = useCallback(async () => {
    const cert = revokeDialog.cert
    if (!cert) return
    setRevokingId(cert.id)
    try {
      await api.patch(`/certificates/${cert.id}`, { status: 'revoked' })
      // Update local state
      setCertificates((prev) =>
        prev.map((c) => (c.id === cert.id ? { ...c, status: 'revoked' } : c))
      )
      toast({
        title: t('certificates.revokedToast'),
        description: t('certificates.revokedToastDesc').replace('{certNumber}', cert.certNumber),
      })
    } catch (e) {
      toast({
        title: t('common.error'),
        description: e instanceof Error ? e.message : t('common.actionFailed'),
        variant: 'destructive',
      })
    } finally {
      setRevokingId(null)
      setRevokeDialog({ open: false, cert: null })
    }
  }, [revokeDialog.cert, toast, t])

  const handleDownload = useCallback(
    (e: React.MouseEvent, cert: Certificate) => {
      e.stopPropagation()
      // Navigate to verify view and trigger print
      navigate('certificate-verify', { hash: cert.verifyHash, print: '1' })
    },
    [navigate]
  )

  if (isStaff) {
    return (
      <StaffCertificatesView
        certificates={certificates}
        loading={loading}
        page={page}
        meta={meta}
        search={search}
        debouncedSearch={debouncedSearch}
        courseId={courseId}
        status={status}
        courses={courses}
        autoGenerating={autoGenerating}
        revokingId={revokingId}
        hasActiveFilters={hasActiveFilters}
        onSearchChange={setSearch}
        onCourseChange={(v) => {
          setCourseId(v)
          setPage(1)
        }}
        onStatusChange={(v) => {
          setStatus(v)
          setPage(1)
        }}
        onClearFilters={clearFilters}
        onPageChange={setPage}
        onAutoGenerate={handleAutoGenerate}
        onView={(c) => navigate('certificate-verify', { hash: c.verifyHash })}
        onDownload={(e, c) => handleDownload(e, c)}
        onRevoke={(c) => setRevokeDialog({ open: true, cert: c })}
        revokeDialog={revokeDialog}
        onRevokeClose={() => setRevokeDialog({ open: false, cert: null })}
        onRevokeConfirm={handleRevoke}
      />
    )
  }

  return (
    <StudentCertificatesView
      certificates={certificates}
      loading={loading}
      page={page}
      meta={meta}
      onView={(c) => navigate('certificate-verify', { hash: c.verifyHash })}
      onDownload={(e, c) => handleDownload(e, c)}
      onPageChange={setPage}
    />
  )
}

// ============== STUDENT VIEW ==============

function StudentCertificatesView({
  certificates,
  loading,
  page,
  meta,
  onView,
  onDownload,
  onPageChange,
}: {
  certificates: Certificate[]
  loading: boolean
  page: number
  meta: { total: number; pages: number }
  onView: (cert: Certificate) => void
  onDownload: (e: React.MouseEvent, cert: Certificate) => void
  onPageChange: (page: number) => void
}) {
  const { t } = useTranslation()
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Award className="w-6 h-6 text-primary" />
          {t('certificates.myCerts')}
        </h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          {t('certificates.myCertsDesc')}
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden pt-0 gap-0">
              <Skeleton className="h-32 w-full rounded-none" />
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-8 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : certificates.length === 0 ? (
        <Card className="p-12">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <Award className="w-10 h-10 text-primary/60" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{t('certificates.noCertsTitle')}</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-md">
                {t('certificates.noCertsDesc')}
              </p>
            </div>
            <Button variant="outline" onClick={() => useNav.getState().navigate('quizzes')}>
              {t('certificates.goToTests')}
            </Button>
          </div>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {certificates.map((cert) => (
              <StudentCertCard
                key={cert.id}
                cert={cert}
                onView={() => onView(cert)}
                onDownload={(e) => onDownload(e, cert)}
              />
            ))}
          </div>

          {!loading && meta.pages > 1 && (
            <Pagination page={page} pages={meta.pages} onPageChange={onPageChange} />
          )}
        </>
      )}
    </div>
  )
}

function StudentCertCard({
  cert,
  onView,
  onDownload,
}: {
  cert: Certificate
  onView: () => void
  onDownload: (e: React.MouseEvent) => void
}) {
  const { t } = useTranslation()
  const primary = cert.template?.primaryColor ?? '#0f766e'
  const accent = cert.template?.accentColor ?? '#ca8a04'
  const studentName = useAuth((s) => s.user)
  const fullName = studentName
    ? `${studentName.lastName} ${studentName.firstName}`.trim()
    : ''

  return (
    <Card
      className="overflow-hidden cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5 pt-0 gap-0 group"
      onClick={onView}
    >
      {/* Mini certificate preview header */}
      <div
        className="relative h-36 px-4 py-4 flex flex-col justify-between text-white"
        style={{
          background: `linear-gradient(135deg, ${primary} 0%, ${primary}dd 50%, ${primary}aa 100%)`,
        }}
      >
        {/* Decorative corner */}
        <div
          className="absolute top-0 right-0 w-24 h-24 opacity-20"
          style={{
            background: `radial-gradient(circle at top right, ${accent}, transparent 70%)`,
          }}
        />
        <div className="flex items-start justify-between relative">
          <div>
            <p className="text-[10px] uppercase tracking-widest opacity-80">{t('certificates.appName')}</p>
            <p className="text-xs font-medium opacity-90 mt-0.5">
              {cert.template?.titleText ?? t('certificates.certificate')}
            </p>
          </div>
          <Award className="w-7 h-7 opacity-80" style={{ color: accent }} />
        </div>
        <div className="relative">
          <p className="text-[11px] opacity-75 line-clamp-1">{fullName}</p>
          <p className="text-xs font-semibold line-clamp-1 leading-tight mt-0.5">
            {cert.course?.title ?? '—'}
          </p>
        </div>
        {/* Bottom border accent */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1"
          style={{ background: accent }}
        />
      </div>

      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <Badge
            variant="secondary"
            className="font-mono text-[10px] px-2 py-0.5"
          >
            <Hash className="w-3 h-3 mr-1" />
            {cert.certNumber}
          </Badge>
          <Badge
            className="text-[11px]"
            style={{
              background: `${primary}15`,
              color: primary,
              border: `1px solid ${primary}30`,
            }}
          >
            <TrendingUp className="w-3 h-3 mr-1" />
            {cert.percentage}%
          </Badge>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="w-3.5 h-3.5" />
          <span>{formatDate(cert.issuedAt)}</span>
          <span className="mx-1">·</span>
          <span>
            {cert.score} / {cert.maxScore} {t('certificates.ball')}
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 gap-2">
        <Button size="sm" variant="outline" className="flex-1" onClick={onView}>
          <Eye className="w-3.5 h-3.5" /> {t('common.view')}
        </Button>
        <Button size="sm" variant="ghost" onClick={onDownload} title={t('common.download')}>
          <Download className="w-3.5 h-3.5" />
        </Button>
      </CardFooter>
    </Card>
  )
}

// ============== STAFF VIEW ==============

function StaffCertificatesView({
  certificates,
  loading,
  page,
  meta,
  search,
  courseId,
  status,
  courses,
  autoGenerating,
  revokingId,
  hasActiveFilters,
  onSearchChange,
  onCourseChange,
  onStatusChange,
  onClearFilters,
  onPageChange,
  onAutoGenerate,
  onView,
  onDownload,
  onRevoke,
  revokeDialog,
  onRevokeClose,
  onRevokeConfirm,
}: {
  certificates: Certificate[]
  loading: boolean
  page: number
  meta: { total: number; pages: number }
  search: string
  courseId: string
  status: string
  courses: Array<{ id: string; title: string }>
  autoGenerating: boolean
  revokingId: string | null
  hasActiveFilters: boolean
  onSearchChange: (v: string) => void
  onCourseChange: (v: string) => void
  onStatusChange: (v: string) => void
  onClearFilters: () => void
  onPageChange: (page: number) => void
  onAutoGenerate: () => void
  onView: (cert: Certificate) => void
  onDownload: (e: React.MouseEvent, cert: Certificate) => void
  onRevoke: (cert: Certificate) => void
  revokeDialog: { open: boolean; cert: Certificate | null }
  onRevokeClose: () => void
  onRevokeConfirm: () => void
}) {
  const { t } = useTranslation()
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Award className="w-6 h-6 text-primary" />
            {t('certificates.registry')}
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {t('certificates.registryDesc')}
          </p>
        </div>
        <Button onClick={onAutoGenerate} disabled={autoGenerating}>
          {autoGenerating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          {t('certificates.autoGenerate')}
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t('certificates.searchPlaceholder')}
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
            {search && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-accent"
                aria-label={t('common.clearSearch')}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={courseId} onValueChange={onCourseChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder={t('certificates.course')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('certificates.allCourses')}</SelectItem>
                {courses.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={onStatusChange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder={t('common.status')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common.allStatuses')}</SelectItem>
                <SelectItem value="active">{t('common.active')}</SelectItem>
                <SelectItem value="revoked">{t('common.revoked')}</SelectItem>
              </SelectContent>
            </Select>
            {hasActiveFilters && (
              <Button variant="ghost" onClick={onClearFilters} size="sm">
                <X className="w-4 h-4" /> {t('common.clear')}
              </Button>
            )}
          </div>
        </div>
        <div className="mt-3 text-xs text-muted-foreground">
          {loading
            ? t('common.loading')
            : t('certificates.resultsFound').replace('{total}', String(meta.total))}
        </div>
      </Card>

      {/* Table */}
      {loading ? (
        <Card className="p-6">
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </Card>
      ) : certificates.length === 0 ? (
        <Card className="p-12">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{t('certificates.noCertsFound')}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {hasActiveFilters
                  ? t('common.tryChangingFilters')
                  : t('certificates.noCertsYet')}
              </p>
            </div>
            {hasActiveFilters && (
              <Button variant="outline" onClick={onClearFilters}>
                {t('common.clearFilters')}
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <Card className="overflow-hidden pt-0 gap-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="min-w-[140px]">{t('certificates.certNumber')}</TableHead>
                <TableHead className="min-w-[180px]">{t('certificates.student')}</TableHead>
                <TableHead className="min-w-[200px]">{t('certificates.course')}</TableHead>
                <TableHead className="min-w-[100px]">{t('certificates.score')}</TableHead>
                <TableHead className="min-w-[120px]">{t('certificates.issuedAt')}</TableHead>
                <TableHead className="min-w-[110px]">{t('common.status')}</TableHead>
                <TableHead className="text-right min-w-[140px]">{t('common.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {certificates.map((cert) => {
                const u = cert.user
                const fullName = u
                  ? `${u.lastName} ${u.firstName}${u.middleName ? ' ' + u.middleName : ''}`
                  : '—'
                const initials = u
                  ? `${u.firstName[0] ?? ''}${u.lastName[0] ?? ''}`.toUpperCase()
                  : '?'
                return (
                  <TableRow key={cert.id} className="hover:bg-muted/30">
                    <TableCell>
                      <span className="font-mono text-xs">{cert.certNumber}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 min-w-0">
                        <Avatar className="w-8 h-8 flex-shrink-0">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm truncate">{fullName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      <span className="line-clamp-1">{cert.course?.title ?? '—'}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono text-xs">
                        {cert.percentage}%
                      </Badge>
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        {cert.score}/{cert.maxScore}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(cert.issuedAt)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={cert.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onView(cert)}
                          title={t('common.view')}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => onDownload(e, cert)}
                          title={t('common.download')}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        {cert.status === 'active' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onRevoke(cert)}
                            disabled={revokingId === cert.id}
                            title={t('certificates.revoke')}
                            className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                          >
                            {revokingId === cert.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <ShieldAlert className="w-4 h-4" />
                            )}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Card>
      )}

      {!loading && meta.pages > 1 && (
        <Pagination page={page} pages={meta.pages} onPageChange={onPageChange} />
      )}

      {/* Revoke confirmation dialog */}
      <Dialog open={revokeDialog.open} onOpenChange={(o) => !o && onRevokeClose()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              {t('certificates.revokeTitle')}
            </DialogTitle>
            <DialogDescription>
              {revokeDialog.cert && (
                <>
                  {t('certificates.revokeWarning').replace('{certNumber}', revokeDialog.cert.certNumber)}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={onRevokeClose}>
              {t('common.cancel')}
            </Button>
            <Button variant="destructive" onClick={onRevokeConfirm}>
              {t('common.confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ============== SHARED COMPONENTS ==============

function StatusBadge({ status }: { status: string }) {
  const { t } = useTranslation()
  if (status === 'active') {
    return (
      <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100">
        <ShieldCheck className="w-3 h-3 mr-1" />
        {t('common.active')}
      </Badge>
    )
  }
  if (status === 'revoked') {
    return (
      <Badge className="bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800 hover:bg-rose-100">
        <ShieldAlert className="w-3 h-3 mr-1" />
        {t('common.revoked')}
      </Badge>
    )
  }
  return <Badge variant="secondary">{status}</Badge>
}

function Pagination({
  page,
  pages,
  onPageChange,
}: {
  page: number
  pages: number
  onPageChange: (page: number) => void
}) {
  const { t } = useTranslation()
  return (
    <div className="flex items-center justify-center gap-2 pt-2">
      <Button
        variant="outline"
        size="sm"
        disabled={page === 1}
        onClick={() => onPageChange(Math.max(1, page - 1))}
      >
        <ChevronLeft className="w-4 h-4" />
        {t('common.prev')}
      </Button>
      <div className="flex items-center gap-1">
        {Array.from({ length: Math.min(5, pages) }).map((_, i) => {
          const startPage = Math.max(1, Math.min(page - 2, pages - 4))
          const pageNum = startPage + i
          if (pageNum > pages) return null
          return (
            <Button
              key={pageNum}
              variant={page === pageNum ? 'default' : 'outline'}
              size="sm"
              className="w-9 h-9 p-0"
              onClick={() => onPageChange(pageNum)}
            >
              {pageNum}
            </Button>
          )
        })}
      </div>
      <Button
        variant="outline"
        size="sm"
        disabled={page >= pages}
        onClick={() => onPageChange(Math.min(pages, page + 1))}
      >
        {t('common.next')}
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  )
}
