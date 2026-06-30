'use client'

import { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { api, type Course, type Lesson } from '@/lib/api'
import { useAuth, useNav } from '@/store/auth'
import { useTranslation, type Language } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import ReactMarkdown from 'react-markdown'
import { useToast } from '@/hooks/use-toast'
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Users,
  PlayCircle,
  FileText,
  File,
  ClipboardList,
  Lock,
  CheckCircle2,
  Circle,
  GraduationCap,
  Calendar,
  Award,
  Download,
  Menu,
  User,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface CourseSection {
  id: string
  courseId: string
  title: string
  description?: string | null
  order: number
  lessons: LessonWithLock[]
}

interface LessonWithLock extends Lesson {
  isLocked?: boolean
}

interface CourseDetail extends Course {
  sections: CourseSection[]
  lessons: LessonWithLock[]
  tutor?: {
    id: string
    firstName: string
    lastName: string
    middleName?: string | null
    position?: string | null
    department?: string | null
    avatarUrl?: string | null
  } | null
  enrollment?: {
    id: string
    progress: number
    status: string
    startedAt: string
    completedAt?: string | null
    deadlineAt?: string | null
  } | null
}

interface DetailResponse {
  status: string
  data: CourseDetail
}

const LEVEL_COLORS: Record<string, string> = {
  beginner: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  intermediate: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  advanced: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
}

const LOCALE_MAP: Record<Language, string> = {
  uz: 'uz-UZ',
  ru: 'ru-RU',
  en: 'en-US',
}

type TFunc = (key: string) => string

function LessonTypeIcon({ type, className }: { type: string; className?: string }) {
  switch (type) {
    case 'video': return <PlayCircle className={className} />
    case 'pdf': return <File className={className} />
    case 'assignment': return <ClipboardList className={className} />
    default: return <FileText className={className} />
  }
}

function formatDuration(min: number, t: TFunc): string {
  if (min < 60) return `${min} ${t('time.minutes_short')}`
  const h = Math.floor(min / 60)
  const m = min % 60
  return m ? `${h} ${t('common.hours')} ${m} ${t('time.minutes_short')}` : `${h} ${t('common.hours')}`
}

function levelLabel(level: string, t: TFunc): string {
  return t(`courses.level.${level}`) || level
}

export function CourseDetailView() {
  const user = useAuth((s) => s.user)!
  const params = useNav((s) => s.params)
  const navigate = useNav((s) => s.navigate)
  const { t, lang } = useTranslation()
  const { toast } = useToast()
  const courseId = params.id

  const [course, setCourse] = useState<CourseDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  // Fetch course detail
  useEffect(() => {
    if (!courseId) return
    let cancelled = false
    // Defer setState to avoid synchronous state update in effect
    Promise.resolve().then(() => {
      if (!cancelled) setLoading(true)
    })
    api
      .get<DetailResponse>(`/courses/${courseId}`)
      .then((r) => {
        if (cancelled) return
        setCourse(r.data)
        // Auto-select first unlocked lesson
        const firstLesson = r.data.sections
          .flatMap((s) => s.lessons)
          .find((l) => !l.isLocked)
        if (firstLesson) setSelectedLessonId(firstLesson.id)
      })
      .catch((e) => {
        if (cancelled) return
        toast({
          title: t('common.error'),
          description: e instanceof Error ? e.message : t('courses.loadError'),
          variant: 'destructive',
        })
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [courseId, toast, t])

  const isEnrolled = !!course?.enrollment
  const isOwner = user.role === 'admin' || (user.role === 'tutor' && course?.tutor?.id === user.id)

  // Find selected lesson
  const selectedLesson = useMemo(() => {
    if (!course || !selectedLessonId) return null
    return (
      course.sections.flatMap((s) => s.lessons).find((l) => l.id === selectedLessonId) ??
      course.lessons.find((l) => l.id === selectedLessonId) ??
      null
    )
  }, [course, selectedLessonId])

  const handleEnroll = async () => {
    if (!courseId) return
    try {
      await api.post(`/courses/${courseId}/enroll`)
      toast({ title: t('common.congrats'), description: t('courses.enrollSuccess') })
      // Refetch course detail to get enrollment + unlock lessons
      const r = await api.get<DetailResponse>(`/courses/${courseId}`)
      setCourse(r.data)
    } catch (e) {
      toast({
        title: t('common.error'),
        description: e instanceof Error ? e.message : t('courses.enrollError'),
        variant: 'destructive',
      })
    }
  }

  // Optimistically update lesson progress in local state
  const updateLessonInState = useCallback(
    (lessonId: string, updater: (l: LessonWithLock) => LessonWithLock) => {
      setCourse((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          sections: prev.sections.map((s) => ({
            ...s,
            lessons: s.lessons.map((l) => (l.id === lessonId ? updater(l) : l)),
          })),
          lessons: prev.lessons.map((l) => (l.id === lessonId ? updater(l) : l)),
        }
      })
    },
    []
  )

  const handleMarkComplete = async (lessonId: string) => {
    if (!courseId) return
    // Optimistic update
    updateLessonInState(lessonId, (l) => ({
      ...l,
      progress: { isCompleted: true, watchTimeSec: l.progress?.watchTimeSec ?? 0, lastPosition: l.progress?.lastPosition ?? 0 },
    }))

    try {
      const r = await api.post<{
        data: { courseProgress: number; completedLessons: number; totalLessons: number; enrollmentStatus: string }
      }>(`/courses/${courseId}/progress`, {
        lessonId,
        isCompleted: true,
      })
      // Update enrollment progress
      setCourse((prev) => prev ? {
        ...prev,
        enrollment: prev.enrollment ? {
          ...prev.enrollment,
          progress: r.data.courseProgress,
          status: r.data.enrollmentStatus,
        } : prev.enrollment,
      } : prev)

      if (r.data.courseProgress >= 100) {
        toast({
          title: t('courses.completedCongrats'),
          description: t('courses.completedDesc'),
        })
      } else {
        toast({ title: t('courses.lessonCompleted'), description: `${t('courses.courseProgressIs')} ${r.data.courseProgress}%` })
      }
    } catch (e) {
      // Revert on error
      updateLessonInState(lessonId, (l) => ({
        ...l,
        progress: { isCompleted: false, watchTimeSec: l.progress?.watchTimeSec ?? 0, lastPosition: l.progress?.lastPosition ?? 0 },
      }))
      toast({
        title: t('common.error'),
        description: e instanceof Error ? e.message : t('courses.progressSaveError'),
        variant: 'destructive',
      })
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-4 w-32" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-32 w-full" />
          </div>
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <Card className="p-12">
        <div className="flex flex-col items-center text-center gap-3">
          <BookOpen className="w-12 h-12 text-muted-foreground" />
          <h3 className="font-semibold text-lg">{t('courses.notFound')}</h3>
          <Button variant="outline" onClick={() => navigate('courses')}>
            <ArrowLeft className="w-4 h-4" /> {t('courses.backToCourses')}
          </Button>
        </div>
      </Card>
    )
  }

  const totalLessons = course._count?.lessons ?? course.sections.reduce((s, sec) => s + sec.lessons.length, 0)
  const completedLessons = course.sections
    .flatMap((s) => s.lessons)
    .filter((l) => l.progress?.isCompleted).length

  return (
    <div className="space-y-4">
      {/* Back button */}
      <Button variant="ghost" size="sm" onClick={() => navigate('courses')}>
        <ArrowLeft className="w-4 h-4" /> {t('nav.courses')}
      </Button>

      {/* Hero section */}
      <Card className="overflow-hidden pt-0 gap-0">
        <div className="relative h-48 sm:h-64 lg:h-72 bg-muted">
          {course.thumbnailUrl ? (
            <img
              src={course.thumbnailUrl}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/30 to-primary/5">
              <BookOpen className="w-16 h-16 text-primary/60" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          {/* Top badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            <Badge className="bg-white/95 text-foreground backdrop-blur">
              {course.category?.icon} {course.category?.name ?? t('courses.noCategory')}
            </Badge>
            <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', LEVEL_COLORS[course.level])}>
              {levelLabel(course.level, t)}
            </span>
            {course.isMandatory && (
              <Badge className="bg-primary text-primary-foreground">
                <GraduationCap className="w-3 h-3" /> {t('common.mandatory')}
              </Badge>
            )}
          </div>

          {/* Title overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight">{course.title}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm">
              {course.tutor && (
                <div className="flex items-center gap-2">
                  <Avatar className="w-6 h-6 ring-2 ring-white/50">
                    <AvatarFallback className="bg-primary text-primary-foreground text-[10px]">
                      {(course.tutor.firstName?.[0] ?? '?')}{(course.tutor.lastName?.[0] ?? '?')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">
                    {course.tutor.firstName} {course.tutor.lastName}
                  </span>
                </div>
              )}
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" /> {course.durationHours} {t('common.hours')}
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" /> {totalLessons} {t('common.lessons')}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" /> {course._count?.enrollments ?? 0} {t('common.students')}
              </span>
            </div>
          </div>
        </div>

        {/* Hero footer */}
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {course.description ?? t('courses.noDescription')}
              </p>
            </div>
            <div className="flex-shrink-0">
              {user.role === 'student' && !isEnrolled && (
                <Button onClick={handleEnroll} size="lg">
                  <GraduationCap className="w-4 h-4" /> {t('courses.enroll')}
                </Button>
              )}
              {user.role === 'student' && isEnrolled && (
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">{t('courses.yourProgress')}</div>
                  <div className="text-2xl font-bold text-primary">{course.enrollment!.progress}%</div>
                </div>
              )}
              {(user.role === 'tutor' || user.role === 'admin') && (
                <Badge variant="secondary" className="capitalize">
                  {t('common.status')}: {course.status}
                </Badge>
              )}
            </div>
          </div>

          {/* Progress bar for enrolled students */}
          {isEnrolled && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                <span>{t('courses.progress')}</span>
                <span>{completedLessons} / {totalLessons} {t('courses.lessonsCompletedSuffix')}</span>
              </div>
              <Progress value={course.enrollment!.progress} className="h-2" />
              {course.enrollment!.deadlineAt && (
                <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5" />
                  {t('courses.deadline')} {new Date(course.enrollment!.deadlineAt!).toLocaleDateString(LOCALE_MAP[lang])}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main layout: sidebar + content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mobile: lesson list toggle */}
        <div className="lg:hidden">
          <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full">
                <Menu className="w-4 h-4" /> {t('courses.lessonList')}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[85vw] max-w-sm p-0 overflow-y-auto">
              <LessonSidebar
                course={course}
                selectedLessonId={selectedLessonId}
                onSelect={(id) => {
                  setSelectedLessonId(id)
                  setMobileSidebarOpen(false)
                }}
                isEnrolled={isEnrolled}
                completedLessons={completedLessons}
                totalLessons={totalLessons}
              />
            </SheetContent>
          </Sheet>
        </div>

        {/* Lesson viewer (main) */}
        <div className="lg:col-span-2 order-1 lg:order-none">
          {selectedLesson ? (
            <LessonViewer
              key={selectedLesson.id}
              lesson={selectedLesson}
              isEnrolled={isEnrolled || isOwner}
              courseId={course.id}
              onMarkComplete={() => handleMarkComplete(selectedLesson.id)}
              onProgress={updateLessonInState}
            />
          ) : (
            <Card className="p-8">
              <div className="flex flex-col items-center text-center gap-3">
                <BookOpen className="w-12 h-12 text-muted-foreground" />
                <h3 className="font-semibold text-lg">{t('courses.selectLesson')}</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  {t('courses.selectLessonDesc')}
                </p>
                {!isEnrolled && user.role === 'student' && (
                  <div className="mt-2 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 max-w-md">
                    <Lock className="w-5 h-5 text-amber-600 mx-auto mb-2" />
                    <p className="text-sm text-amber-700 dark:text-amber-400">
                      {t('courses.enrollToView')}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Course info panel below viewer */}
          <CourseInfoPanel course={course} isEnrolled={isEnrolled} />
        </div>

        {/* Desktop sidebar */}
        <div className="hidden lg:block order-2">
          <Card className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-hidden">
            <LessonSidebar
              course={course}
              selectedLessonId={selectedLessonId}
              onSelect={setSelectedLessonId}
              isEnrolled={isEnrolled}
              completedLessons={completedLessons}
              totalLessons={totalLessons}
            />
          </Card>
        </div>
      </div>
    </div>
  )
}

function LessonSidebar({
  course,
  selectedLessonId,
  onSelect,
  isEnrolled,
  completedLessons,
  totalLessons,
}: {
  course: CourseDetail
  selectedLessonId: string | null
  onSelect: (id: string) => void
  isEnrolled: boolean
  completedLessons: number
  totalLessons: number
}) {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col h-full">
      <CardHeader className="border-b">
        <CardTitle className="text-base flex items-center gap-2">
          <BookOpen className="w-4 h-4" /> {t('courses.lessons')}
        </CardTitle>
        <CardDescription className="text-xs">
          {completedLessons} / {totalLessons} {t('courses.lessonsCompletedSuffix')}
          {!isEnrolled && ` • ${t('courses.enrollPrompt')}`}
        </CardDescription>
        <Progress value={totalLessons ? (completedLessons / totalLessons) * 100 : 0} className="h-1.5 mt-2" />
      </CardHeader>
      <ScrollArea className="flex-1 max-h-[calc(100vh-12rem)]">
        <div className="p-2">
          {course.sections.map((section) => (
            <div key={section.id} className="mb-3">
              <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {section.title}
              </div>
              <div className="space-y-0.5">
                {section.lessons.map((lesson) => (
                  <LessonListItem
                    key={lesson.id}
                    lesson={lesson}
                    active={lesson.id === selectedLessonId}
                    onClick={() => !lesson.isLocked && onSelect(lesson.id)}
                  />
                ))}
              </div>
            </div>
          ))}
          {course.sections.length === 0 && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              {t('courses.noLessons')}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

function LessonListItem({
  lesson,
  active,
  onClick,
}: {
  lesson: LessonWithLock
  active: boolean
  onClick: () => void
}) {
  const { t } = useTranslation()
  const isCompleted = lesson.progress?.isCompleted
  const isLocked = lesson.isLocked

  return (
    <button
      onClick={onClick}
      disabled={isLocked}
      className={cn(
        'w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors text-left',
        active
          ? 'bg-primary/10 text-primary font-medium'
          : isLocked
            ? 'text-muted-foreground/60 cursor-not-allowed'
            : 'hover:bg-accent'
      )}
    >
      {/* Status icon */}
      {isLocked ? (
        <Lock className="w-3.5 h-3.5 flex-shrink-0" />
      ) : isCompleted ? (
        <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
      ) : (
        <Circle className="w-4 h-4 flex-shrink-0 text-muted-foreground/40" />
      )}

      <LessonTypeIcon type={lesson.type} className={cn('w-3.5 h-3.5 flex-shrink-0', active && 'text-primary')} />

      <span className="flex-1 truncate text-xs">{lesson.title}</span>
      <span className="text-[10px] text-muted-foreground flex-shrink-0">
        {formatDuration(lesson.durationMin, t)}
      </span>
    </button>
  )
}

function LessonViewer({
  lesson,
  isEnrolled,
  courseId,
  onMarkComplete,
  onProgress,
}: {
  lesson: LessonWithLock
  isEnrolled: boolean
  courseId: string
  onMarkComplete: () => void
  onProgress: (lessonId: string, updater: (l: LessonWithLock) => LessonWithLock) => void
}) {
  const { t } = useTranslation()
  const { toast } = useToast()
  const videoRef = useRef<HTMLVideoElement>(null)
  const lastSaveRef = useRef<number>(0)
  const watchTimeRef = useRef<number>(lesson.progress?.watchTimeSec ?? 0)
  const isCompleted = lesson.progress?.isCompleted

  // Throttled progress save for video
  const saveVideoProgress = useCallback(
    (currentTime: number, additionalWatchTime: number) => {
      const now = Date.now()
      if (now - lastSaveRef.current < 10000) return // throttle: 10s
      lastSaveRef.current = now

      watchTimeRef.current = Math.max(watchTimeRef.current, additionalWatchTime)

      api
        .post(`/courses/${courseId}/progress`, {
          lessonId: lesson.id,
          watchTimeSec: watchTimeRef.current,
          lastPosition: Math.floor(currentTime),
        })
        .then((r) => {
          // Sync course-level progress (silently)
          const data = (r as { data?: { courseProgress?: number } })?.data
          if (data?.courseProgress !== undefined) {
            // Could bubble up — but for simplicity just update lesson locally
          }
        })
        .catch(() => {})
    },
    [courseId, lesson.id]
  )

  const handleVideoTimeUpdate = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement>) => {
      const v = e.currentTarget
      // Accumulate watch time
      watchTimeRef.current += 1
      saveVideoProgress(v.currentTime, watchTimeRef.current)
    },
    [saveVideoProgress]
  )

  const handleVideoPause = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement>) => {
      const v = e.currentTarget
      // Force save on pause
      lastSaveRef.current = 0
      saveVideoProgress(v.currentTime, watchTimeRef.current)
    },
    [saveVideoProgress]
  )

  // Restore last video position on mount
  useEffect(() => {
    if (lesson.type === 'video' && videoRef.current && lesson.progress?.lastPosition) {
      const t = setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.currentTime = lesson.progress!.lastPosition
        }
      }, 200)
      return () => clearTimeout(t)
    }
  }, [lesson.id, lesson.type, lesson.progress?.lastPosition])

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <LessonTypeIcon type={lesson.type} className="w-3.5 h-3.5" />
              <span className="capitalize">{t(`courses.lessonType.${lesson.type}`) || lesson.type}</span>
              <span>•</span>
              <span>{formatDuration(lesson.durationMin, t)}</span>
              {lesson.isFree && !isEnrolled && (
                <>
                  <span>•</span>
                  <Badge variant="secondary" className="text-[10px] py-0">{t('common.free')}</Badge>
                </>
              )}
            </div>
            <CardTitle className="text-lg leading-snug">{lesson.title}</CardTitle>
            {lesson.description && (
              <CardDescription className="mt-1">{lesson.description}</CardDescription>
            )}
          </div>
          {isCompleted && (
            <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
              <CheckCircle2 className="w-3 h-3" /> {t('courses.completed')}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Lesson content */}
        <div className="p-4 sm:p-6">
          {lesson.type === 'video' && lesson.videoUrl ? (
            <div className="space-y-3">
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  src={lesson.videoUrl}
                  controls
                  className="w-full h-full"
                  onTimeUpdate={handleVideoTimeUpdate}
                  onPause={handleVideoPause}
                  onEnded={() => {
                    lastSaveRef.current = 0
                    saveVideoProgress(0, watchTimeRef.current)
                  }}
                  controlsList="nodownload"
                >
                  <track kind="captions" />
                </video>
              </div>
              {!isEnrolled && (
                <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  {t('courses.enrollForVideo')}
                </div>
              )}
            </div>
          ) : lesson.type === 'text' && lesson.content ? (
            <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary prose-strong:text-foreground prose-code:bg-muted prose-code:rounded prose-code:px-1 prose-code:py-0.5 prose-code:before:content-none prose-code:after:content-none">
              <ReactMarkdown>{lesson.content}</ReactMarkdown>
            </div>
          ) : lesson.type === 'pdf' ? (
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center border-2 border-dashed border-border rounded-lg">
                <File className="w-16 h-16 text-muted-foreground/40 mb-3" />
                <h3 className="font-semibold">{t('courses.pdfDoc')}</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-md">
                  {t('courses.pdfDesc')}
                </p>
                {lesson.fileUrl ? (
                  <Button asChild className="mt-4">
                    <a href={lesson.fileUrl} download target="_blank" rel="noopener noreferrer">
                      <Download className="w-4 h-4" /> {t('common.download')}
                    </a>
                  </Button>
                ) : (
                  <Badge variant="secondary" className="mt-4">{t('courses.noFile')}</Badge>
                )}
              </div>
            </div>
          ) : lesson.type === 'assignment' ? (
            <div className="space-y-3">
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center border-2 border-dashed border-border rounded-lg">
                <ClipboardList className="w-16 h-16 text-muted-foreground/40 mb-3" />
                <h3 className="font-semibold">{t('courses.assignment')}</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-md">
                  {t('courses.assignmentDesc')}
                </p>
              </div>
              {lesson.content && (
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown>{lesson.content}</ReactMarkdown>
                </div>
              )}
            </div>
          ) : (
            <div className="py-12 text-center text-sm text-muted-foreground">
              {t('courses.noContent')}
            </div>
          )}
        </div>

        {/* Footer: mark complete */}
        {isEnrolled && (
          <>
            <Separator />
            <div className="p-4 flex items-center justify-between gap-3">
              <div className="text-xs text-muted-foreground">
                {isCompleted
                  ? t('courses.lessonAlreadyCompleted')
                  : t('courses.markCompletePrompt')}
              </div>
              <Button
                onClick={onMarkComplete}
                disabled={isCompleted}
                variant={isCompleted ? 'outline' : 'default'}
              >
                {isCompleted ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> {t('courses.completed')}
                  </>
                ) : (
                  t('courses.markComplete')
                )}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

function CourseInfoPanel({ course, isEnrolled }: { course: CourseDetail; isEnrolled: boolean }) {
  const { t } = useTranslation()
  const navigate = useNav((s) => s.navigate)
  const { toast } = useToast()

  const handleEnroll = async () => {
    try {
      await api.post(`/courses/${course.id}/enroll`)
      toast({ title: t('common.congrats'), description: t('courses.enrollSuccess') })
      // Reload page state via navigation re-render
      navigate('course-detail', { id: course.id })
      // Force a refresh by re-fetching
      window.location.reload()
    } catch (e) {
      toast({
        title: t('common.error'),
        description: e instanceof Error ? e.message : t('courses.enrollError'),
        variant: 'destructive',
      })
    }
  }

  const learnPoints = [
    t('courses.learnPoint1'),
    t('courses.learnPoint2'),
    t('courses.learnPoint3'),
    t('courses.learnPoint4'),
  ]

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg">{t('courses.about')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Description */}
        <div>
          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" /> {t('courses.description')}
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
            {course.description ?? t('courses.noDescription')}
          </p>
        </div>

        <Separator />

        {/* What you'll learn */}
        <div>
          <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <Award className="w-4 h-4 text-primary" /> {t('courses.whatYouWillLearn')}
          </h4>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            {learnPoints.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <Separator />

        {/* Tutor info */}
        {course.tutor && (
          <div>
            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-primary" /> {t('courses.tutor')}
            </h4>
            <div className="flex items-start gap-3">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {(course.tutor.firstName?.[0] ?? '?')}{(course.tutor.lastName?.[0] ?? '?')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="font-medium">
                  {course.tutor.firstName} {course.tutor.lastName}
                  {course.tutor.middleName ? ' ' + course.tutor.middleName : ''}
                </div>
                {course.tutor.position && (
                  <div className="text-sm text-muted-foreground">{course.tutor.position}</div>
                )}
                {course.tutor.department && (
                  <div className="text-xs text-muted-foreground mt-0.5">{course.tutor.department}</div>
                )}
              </div>
            </div>
          </div>
        )}

        <Separator />

        {/* Course stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">{t('courses.levelLabel')}</div>
            <div className="font-medium">{levelLabel(course.level, t)}</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">{t('courses.duration')}</div>
            <div className="font-medium">{course.durationHours} {t('common.hours')}</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">{t('courses.lessonsCount')}</div>
            <div className="font-medium">{course._count?.lessons ?? 0}</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">{t('courses.enrolledCount')}</div>
            <div className="font-medium">{course._count?.enrollments ?? 0}</div>
          </div>
        </div>

        {/* CTA for non-enrolled students */}
        {!isEnrolled && (
          <>
            <Separator />
            <div className="rounded-lg bg-primary/5 border border-primary/20 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="font-semibold">{t('courses.startToday')}</div>
                <div className="text-sm text-muted-foreground">
                  {t('courses.enrollTodayDesc')}
                </div>
              </div>
              <Button onClick={handleEnroll}>
                <GraduationCap className="w-4 h-4" /> {t('courses.enroll')}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
