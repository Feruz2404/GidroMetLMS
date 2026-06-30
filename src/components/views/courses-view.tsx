'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'
import { api, type Course } from '@/lib/api'
import { useAuth, useNav } from '@/store/auth'
import { useTranslation } from '@/lib/i18n'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
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
  Clock,
  Users,
  Plus,
  GraduationCap,
  Filter,
  Sparkles,
  ArrowRight,
  X,
  AlertCircle,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Category {
  id: string
  name: string
  slug: string
  icon?: string | null
  _count?: { courses: number }
}

interface CoursesResponse {
  status: string
  data: Course[]
  meta?: { total: number; page: number; pages: number; limit: number }
}

const LEVEL_COLORS: Record<string, string> = {
  beginner: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
  intermediate: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  advanced: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800',
}

const PAGE_SIZE = 12

export function CoursesView() {
  const user = useAuth((s) => s.user)!
  const navigate = useNav((s) => s.navigate)
  const { t } = useTranslation()
  const { toast } = useToast()

  const [courses, setCourses] = useState<Course[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [meta, setMeta] = useState<{ total: number; pages: number }>({ total: 0, pages: 1 })

  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [categoryId, setCategoryId] = useState<string>('all')
  const [level, setLevel] = useState<string>('all')
  const [sort, setSort] = useState<string>('newest')

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 350)
    return () => clearTimeout(t)
  }, [search])

  // Fetch categories once
  useEffect(() => {
    api
      .get<{ data: Category[] }>('/categories')
      .then((r) => setCategories(r.data))
      .catch(() => {})
  }, [])

  // Build query string
  const queryString = useMemo(() => {
    const p = new URLSearchParams()
    p.set('page', String(page))
    p.set('limit', String(PAGE_SIZE))
    p.set('sort', sort)
    if (debouncedSearch) p.set('search', debouncedSearch)
    if (categoryId !== 'all') p.set('categoryId', categoryId)
    if (level !== 'all') p.set('level', level)
    return p.toString()
  }, [page, sort, debouncedSearch, categoryId, level])

  useEffect(() => {
    let cancelled = false
    // Use a microtask to defer state update (avoid synchronous setState in effect body)
    Promise.resolve().then(() => {
      if (!cancelled) setLoading(true)
    })
    api
      .get<CoursesResponse>(`/courses?${queryString}`)
      .then((r) => {
        if (cancelled) return
        setCourses(r.data ?? [])
        if (r.meta) setMeta({ total: r.meta.total, pages: r.meta.pages })
      })
      .catch((e) => {
        if (cancelled) return
        toast({
          title: t('common.error'),
          description: (e as Error).message || t('courses.loadError'),
          variant: 'destructive',
        })
        setCourses([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [queryString, toast, t])

  const refetchCourses = useCallback(() => {
    // Re-trigger by toggling state — used after enroll
    Promise.resolve().then(() => setLoading(true))
    api
      .get<CoursesResponse>(`/courses?${queryString}`)
      .then((r) => {
        setCourses(r.data ?? [])
        if (r.meta) setMeta({ total: r.meta.total, pages: r.meta.pages })
      })
      .finally(() => setLoading(false))
  }, [queryString])

  const handleEnroll = async (e: React.MouseEvent, courseId: string) => {
    e.stopPropagation()
    try {
      await api.post(`/courses/${courseId}/enroll`)
      toast({ title: t('common.success'), description: t('courses.enrollSuccess') })
      refetchCourses()
    } catch (e) {
      toast({
        title: t('common.error'),
        description: e instanceof Error ? e.message : t('courses.enrollError'),
        variant: 'destructive',
      })
    }
  }

  const handleCreateCourse = () => {
    toast({
      title: t('common.comingSoon'),
      description: t('courses.createFormSoon'),
    })
  }

  const clearFilters = () => {
    setSearch('')
    setCategoryId('all')
    setLevel('all')
    setSort('newest')
    setPage(1)
  }

  const hasActiveFilters = debouncedSearch || categoryId !== 'all' || level !== 'all'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            {t('courses.title')}
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {t('courses.heroSubtitle')}
          </p>
        </div>
        {(user.role === 'tutor' || user.role === 'admin') && (
          <Button onClick={handleCreateCourse}>
            <Plus className="w-4 h-4" /> {t('courses.newCourse')}
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t('courses.searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-accent"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <Select value={categoryId} onValueChange={(v) => { setCategoryId(v); setPage(1) }}>
              <SelectTrigger className="w-[180px]">
                <Filter className="w-4 h-4 mr-1 text-muted-foreground" />
                <SelectValue placeholder={t('courses.category')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common.allCategories')}</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.icon} {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={level} onValueChange={(v) => { setLevel(v); setPage(1) }}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder={t('courses.level')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common.allLevels')}</SelectItem>
                <SelectItem value="beginner">{t('courses.level.beginner')}</SelectItem>
                <SelectItem value="intermediate">{t('courses.level.intermediate')}</SelectItem>
                <SelectItem value="advanced">{t('courses.level.advanced')}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sort} onValueChange={(v) => { setSort(v); setPage(1) }}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">{t('common.newest')}</SelectItem>
                <SelectItem value="popular">{t('common.popular')}</SelectItem>
                <SelectItem value="title">{t('common.byTitle')}</SelectItem>
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
            {loading ? t('common.loading') : `${meta.total} ${t('courses.foundCount')}`}
          </span>
          {user.role === 'student' && (
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              {t('courses.startLearning')}
            </span>
          )}
        </div>
      </Card>

      {/* Course grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-40 w-full rounded-none" />
              <CardContent className="pt-4 space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-20" />
                </div>
                <Skeleton className="h-8 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <Card className="p-12">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{t('courses.noCoursesFound')}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {hasActiveFilters
                  ? t('courses.tryChangeFilters')
                  : t('courses.noneAvailable')}
              </p>
            </div>
            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters}>
                {t('courses.clearFilters')}
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              isStudent={user.role === 'student'}
              onOpen={() => navigate('course-detail', { id: course.id })}
              onEnroll={(e) => handleEnroll(e, course.id)}
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

function CourseCard({
  course,
  isStudent,
  onOpen,
  onEnroll,
}: {
  course: Course
  isStudent: boolean
  onOpen: () => void
  onEnroll: (e: React.MouseEvent) => void
}) {
  const { t } = useTranslation()
  const enrolled = !!course.enrollment
  const tutorName = course.tutor ? `${course.tutor.firstName} ${course.tutor.lastName}` : ''
  const levelLabel = t(`courses.level.${course.level}`) ?? course.level

  return (
    <Card
      className="overflow-hidden cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5 group pt-0 gap-0"
      onClick={onOpen}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[16/9] overflow-hidden bg-muted">
        {course.thumbnailUrl ? (
          <img
            src={course.thumbnailUrl}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
            <BookOpen className="w-10 h-10 text-primary/60" />
          </div>
        )}

        {/* Top badges */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          <Badge variant="secondary" className="bg-white/95 backdrop-blur text-xs">
            {course.category?.icon} {course.category?.name ?? t('courses.noCategory')}
          </Badge>
        </div>
        <div className="absolute top-2 right-2">
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${LEVEL_COLORS[course.level] ?? ''}`}>
            {levelLabel}
          </span>
        </div>

        {course.isMandatory && (
          <div className="absolute bottom-2 left-2">
            <Badge className="bg-primary/90 text-primary-foreground text-xs">
              <GraduationCap className="w-3 h-3" /> {t('common.mandatory')}
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4 space-y-2">
        <h3 className="font-semibold line-clamp-2 leading-snug min-h-[2.5rem]">
          {course.title}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-2 min-h-[2rem]">
          {course.description ?? t('courses.noDescription')}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {course.durationHours} {t('common.hours')}
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" />
            {course._count?.lessons ?? 0} {t('common.lessons')}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {course._count?.enrollments ?? 0}
          </span>
        </div>

        {/* Tutor */}
        {tutorName && (
          <div className="flex items-center gap-2 pt-1">
            <Avatar className="w-6 h-6">
              <AvatarFallback className="bg-primary/10 text-primary text-[10px]">
                {(course.tutor!.firstName?.[0] ?? '?')}{(course.tutor!.lastName?.[0] ?? '?')}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground truncate">{tutorName}</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0">
        {isStudent ? (
          enrolled ? (
            <div className="w-full space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{t('courses.progress')}</span>
                <span className="font-medium text-primary">{course.enrollment!.progress}%</span>
              </div>
              <Progress value={course.enrollment!.progress} className="h-1.5" />
              <Button size="sm" className="w-full" variant="default">
                {t('courses.continue')} <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              className="w-full"
              variant="outline"
              onClick={onEnroll}
            >
              {t('courses.enroll')}
            </Button>
          )
        ) : (
          <Button size="sm" className="w-full" variant="outline">
            {t('courses.view')} <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
