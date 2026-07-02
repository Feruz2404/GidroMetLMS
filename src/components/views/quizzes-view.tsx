'use client'

import { useEffect, useState, useMemo } from 'react'
import { api, type Quiz } from '@/lib/api'
import { useAuth, useNav } from '@/store/auth'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
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
  FileQuestion,
  Clock,
  ListChecks,
  Trophy,
  Plus,
  ArrowRight,
  X,
  AlertCircle,
  Eye,
  GraduationCap,
  XCircle,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useTranslation } from '@/lib/i18n'

interface QuizListItem extends Quiz {
  myAttempts?: number
  bestScore?: number | null
}

interface CoursesListResponse {
  status: string
  data: CourseMini[]
  meta?: { total: number; page: number; pages: number; limit: number }
}

interface CourseMini {
  id: string
  title: string
}

interface QuizzesResponse {
  status: string
  data: QuizListItem[]
  meta?: { total: number; page: number; pages: number; limit: number }
}

const PAGE_SIZE = 9

export function QuizzesView() {
  const user = useAuth((s) => s.user)!
  const navigate = useNav((s) => s.navigate)
  const { toast } = useToast()
  const { t } = useTranslation()

  const [quizzes, setQuizzes] = useState<QuizListItem[]>([])
  const [courses, setCourses] = useState<CourseMini[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [meta, setMeta] = useState<{ total: number; pages: number }>({ total: 0, pages: 1 })

  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [courseId, setCourseId] = useState<string>('all')
  const [status, setStatus] = useState<string>('all')

  const isStaff = user.role === 'tutor' || user.role === 'admin'

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 350)
    return () => clearTimeout(t)
  }, [search])

  // Fetch courses once for filter
  useEffect(() => {
    api
      .get<CoursesListResponse>(`/courses?limit=60`)
      .then((r) => setCourses(r.data ?? []))
      .catch(() => {})
  }, [])

  const queryString = useMemo(() => {
    const p = new URLSearchParams()
    p.set('page', String(page))
    p.set('limit', String(PAGE_SIZE))
    if (debouncedSearch) p.set('search', debouncedSearch)
    if (courseId !== 'all') p.set('courseId', courseId)
    if (isStaff && status !== 'all') p.set('status', status)
    return p.toString()
  }, [page, debouncedSearch, courseId, status, isStaff])

  useEffect(() => {
    let cancelled = false
    Promise.resolve().then(() => {
      if (!cancelled) setLoading(true)
    })
    api
      .get<QuizzesResponse>(`/quizzes?${queryString}`)
      .then((r) => {
        if (cancelled) return
        setQuizzes(r.data ?? [])
        if (r.meta) setMeta({ total: r.meta.total, pages: r.meta.pages })
      })
      .catch((e) => {
        if (cancelled) return
        toast({
          title: t('common.error'),
          description: (e as Error).message || t('quizzes.loadFailed'),
          variant: 'destructive',
        })
        setQuizzes([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryString])

  const handleCreateQuiz = () => {
    toast({
      title: t('common.comingSoon'),
      description: t('quizzes.createFormSoon'),
    })
  }

  const handleStartQuiz = (quiz: QuizListItem) => {
    if (quiz.status !== 'published') {
      toast({
        title: t('quizzes.notPublished'),
        description: t('quizzes.onlyPublished'),
        variant: 'destructive',
      })
      return
    }
    if (user.role === 'student' && (quiz.myAttempts ?? 0) >= quiz.maxAttempts) {
      toast({
        title: t('quizzes.attemptsExceeded'),
        description: t('quizzes.maxAttemptsUsed').replace('{n}', String(quiz.maxAttempts)),
        variant: 'destructive',
      })
      return
    }
    navigate('quiz-taking', { id: quiz.id })
  }

  const handleViewResults = (quiz: QuizListItem) => {
    // Open quiz-taking in review mode (will fetch latest attempt on mount)
    navigate('quiz-taking', { id: quiz.id, mode: 'review' })
  }

  const clearFilters = () => {
    setSearch('')
    setCourseId('all')
    setStatus('all')
    setPage(1)
  }

  const hasActiveFilters = !!debouncedSearch || courseId !== 'all' || status !== 'all'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileQuestion className="w-6 h-6 text-primary" />
            {t('quizzes.title')}
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {t('quizzes.tryYourKnowledge')}
          </p>
        </div>
        {isStaff && (
          <Button onClick={handleCreateQuiz}>
            <Plus className="w-4 h-4" /> {t('quizzes.newQuiz')}
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
              placeholder={t('quizzes.searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-accent"
                aria-label={t('common.clear')}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <Select value={courseId} onValueChange={(v) => { setCourseId(v); setPage(1) }}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder={t('quizzes.course')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('quizzes.allCourses')}</SelectItem>
                {courses.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {isStaff && (
              <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1) }}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder={t('common.status')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('common.allStatuses')}</SelectItem>
                  <SelectItem value="published">{t('common.published')}</SelectItem>
                  <SelectItem value="draft">{t('common.draft')}</SelectItem>
                </SelectContent>
              </Select>
            )}

            {hasActiveFilters && (
              <Button variant="ghost" onClick={clearFilters} size="sm">
                <X className="w-4 h-4" /> {t('common.clear')}
              </Button>
            )}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {loading ? t('common.loading') : `${meta.total} ${t('quizzes.foundCount')}`}
          </span>
          {user.role === 'student' && (
            <span className="flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-primary" />
              {t('quizzes.tryQuizHint')}
            </span>
          )}
        </div>
      </Card>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="p-5 gap-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <div className="flex gap-2 mt-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
              </div>
              <Skeleton className="h-8 w-full mt-2" />
            </Card>
          ))}
        </div>
      ) : quizzes.length === 0 ? (
        <Card className="p-12">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{t('quizzes.noQuizzesFound')}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {hasActiveFilters
                  ? t('quizzes.tryChangeFilters')
                  : t('quizzes.noQuizzesYet')}
              </p>
            </div>
            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters}>
                {t('quizzes.clearFilters')}
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quizzes.map((quiz) => (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              isStudent={user.role === 'student'}
              onStart={() => handleStartQuiz(quiz)}
              onViewResults={() => handleViewResults(quiz)}
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

function QuizCard({
  quiz,
  isStudent,
  onStart,
  onViewResults,
}: {
  quiz: QuizListItem
  isStudent: boolean
  onStart: () => void
  onViewResults: () => void
}) {
  const { t } = useTranslation()
  const attemptsUsed = quiz.myAttempts ?? 0
  const attemptsRemaining = Math.max(0, quiz.maxAttempts - attemptsUsed)
  const hasAttempted = attemptsUsed > 0
  const bestScore = quiz.bestScore
  const passed = bestScore !== null && bestScore !== undefined && bestScore >= quiz.passingScore

  return (
    <Card className="flex flex-col gap-0 p-0 overflow-hidden hover:shadow-md transition-all hover:-translate-y-0.5">
      <CardHeader className="p-5 pb-3 gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <FileQuestion className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0">
              <Badge
                variant={quiz.status === 'published' ? 'default' : 'secondary'}
                className="text-[10px] mb-1"
              >
                {quiz.status === 'published' ? t('common.published') : t('common.draft')}
              </Badge>
            </div>
          </div>
          {hasAttempted && bestScore !== null && bestScore !== undefined && (
            <Badge
              variant="outline"
              className={
                passed
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800'
                  : 'border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800'
              }
            >
              {passed ? <Trophy className="w-3 h-3" /> : <GraduationCap className="w-3 h-3" />}
              {bestScore}%
            </Badge>
          )}
        </div>
        <CardTitle className="text-base leading-snug line-clamp-2">
          {quiz.title}
        </CardTitle>
        <CardDescription className="line-clamp-2 text-xs min-h-[2rem]">
          {quiz.description ?? t('quizzes.noDescription')}
        </CardDescription>
      </CardHeader>

      <CardContent className="px-5 py-3 flex-1">
        {/* Course */}
        {quiz.course && (
          <div className="text-xs text-muted-foreground mb-3 flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate min-w-0">{quiz.course.title}</span>
          </div>
        )}

        {/* Meta */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="flex flex-col gap-0.5">
            <span className="text-muted-foreground">{t('quizzes.questions')}</span>
            <span className="font-semibold flex items-center gap-1">
              <ListChecks className="w-3.5 h-3.5 text-primary" />
              {quiz._count?.questions ?? 0}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-muted-foreground">{t('quizzes.time')}</span>
            <span className="font-semibold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-primary" />
              {quiz.timeLimitMin} {t('common.minutes')}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-muted-foreground">{t('quizzes.passing')}</span>
            <span className="font-semibold flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-primary" />
              {quiz.passingScore}%
            </span>
          </div>
        </div>

        {/* Attempts progress for students */}
        {isStudent && (
          <div className="mt-4 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{t('quizzes.attemptsUsed')}</span>
              <span className="font-medium">
                {attemptsUsed} / {quiz.maxAttempts}
              </span>
            </div>
            <Progress value={quiz.maxAttempts > 0 ? (attemptsUsed / quiz.maxAttempts) * 100 : 0} className="h-1.5" />
            {attemptsRemaining === 0 && (
              <p className="text-[11px] text-destructive flex items-center gap-1 mt-1">
                <XCircle className="w-3 h-3" /> {t('quizzes.noAttemptsLeft')}
              </p>
            )}
            {attemptsRemaining > 0 && hasAttempted && (
              <p className="text-[11px] text-muted-foreground">
                {attemptsRemaining} {t('quizzes.attemptsRemainingCount')}
              </p>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="p-5 pt-3 flex gap-2 border-t bg-muted/20">
        {isStudent ? (
          <>
            <Button
              size="sm"
              className="flex-1"
              onClick={onStart}
              disabled={attemptsRemaining === 0 || quiz.status !== 'published'}
            >
              {hasAttempted ? t('quizzes.retry') : t('quizzes.startQuiz')}
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
            {hasAttempted && (
              <Button size="sm" variant="outline" onClick={onViewResults}>
                <Eye className="w-3.5 h-3.5" />
                <span className="sr-only sm:not-sr-only">{t('quizzes.result')}</span>
              </Button>
            )}
          </>
        ) : (
          <Button
            size="sm"
            variant="outline"
            className="w-full"
            onClick={onStart}
          >
            <Eye className="w-3.5 h-3.5" />
            {t('common.view')}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
