'use client'

import Link from 'next/link'
import { Layers } from 'lucide-react'
import { EmptyState } from '@/components/shared/empty-state'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { useI18n } from '@/i18n/provider'
import { routes } from '@/lib/routes'
import { cn } from '@/lib/utils'
import type { CourseDetailDto, LessonOutlineDto } from '@/shared/dto'
import { activeEnrollment, flattenLessons, formatMinutes, LessonStatusIcon, sectionTitle, totalMinutes } from './lesson-meta'

const OPEN_ALL_LIMIT = 4

function LessonRow({ courseId, lesson, showPreview, isNext }: { courseId: string; lesson: LessonOutlineDto; showPreview: boolean; isNext: boolean }) {
  const { t } = useI18n()
  const body = (
    <>
      <LessonStatusIcon lesson={lesson} />
      <span className="min-w-0 flex-1">
        <span className={cn('block text-sm font-medium leading-snug', !lesson.isLocked && 'group-hover:text-primary')}>{lesson.title}</span>
        <span className="mt-0.5 block text-xs text-muted-foreground">
          {t(`courses.lessonType.${lesson.type}`)} · {formatMinutes(t, lesson.durationMin)}
          {lesson.isLocked && <span className="sr-only"> · {t('courses.curriculum.locked')}</span>}
          {lesson.isCompleted && <span className="sr-only"> · {t('status.completed')}</span>}
        </span>
      </span>
      {isNext && <Badge variant="brand">{t('courses.curriculum.upNext')}</Badge>}
      {showPreview && lesson.isFree && <Badge variant="info">{t('courses.curriculum.preview')}</Badge>}
    </>
  )
  const rowClass = 'flex items-center gap-3 px-5 py-3'
  if (lesson.isLocked) {
    return (
      <li className={cn(rowClass, 'text-muted-foreground')} title={t('courses.curriculum.lockedHint')}>
        {body}
      </li>
    )
  }
  return (
    <li>
      <Link
        href={routes.lesson(courseId, lesson.id)}
        className={cn(rowClass, 'group transition-colors hover:bg-muted/50 focus-visible:bg-muted/60 focus-visible:outline-none')}
      >
        {body}
      </Link>
    </li>
  )
}

export function CourseCurriculum({ course }: { course: CourseDetailDto }) {
  const { t } = useI18n()
  const enrolled = Boolean(activeEnrollment(course))
  const lessons = flattenLessons(course)
  const showNext = enrolled && course.enrollment?.status !== 'completed'

  if (lessons.length === 0) {
    return <EmptyState icon={Layers} title={t('courses.curriculum.empty')} description={t('courses.curriculum.emptyHint')} />
  }

  const current = course.sections.find((section) => section.lessons.some((lesson) => lesson.id === course.nextLessonId))
  const defaultOpen =
    course.sections.length <= OPEN_ALL_LIMIT ? course.sections.map((section) => section.id) : [current?.id ?? course.sections[0].id]

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        {t('courses.curriculum.summary', {
          sections: course.sections.length,
          lessons: lessons.length,
          duration: formatMinutes(t, totalMinutes(lessons)),
        })}
      </p>
      <Accordion type="multiple" defaultValue={defaultOpen} className="overflow-hidden rounded-xl border bg-card shadow-[var(--shadow-card)]">
        {course.sections.map((section, index) => {
          const done = section.lessons.filter((lesson) => lesson.isCompleted).length
          return (
            <AccordionItem key={section.id} value={section.id}>
              <AccordionTrigger className="items-center rounded-none px-5 py-4 hover:bg-muted/40 hover:no-underline">
                <span className="flex min-w-0 flex-1 items-center gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold tabular-nums text-primary">
                    {index + 1}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold leading-snug">{sectionTitle(t, section)}</span>
                    <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
                      {t('common.lessons', { count: section.lessons.length })} · {formatMinutes(t, totalMinutes(section.lessons))}
                      {enrolled && ` · ${t('courses.curriculum.sectionDone', { done, total: section.lessons.length })}`}
                    </span>
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-0">
                {section.description && <p className="border-t bg-muted/20 px-5 py-3 text-sm text-muted-foreground">{section.description}</p>}
                <ol className="divide-y border-t">
                  {section.lessons.map((lesson) => (
                    <LessonRow key={lesson.id} courseId={course.id} lesson={lesson} showPreview={!enrolled} isNext={showNext && lesson.id === course.nextLessonId} />
                  ))}
                </ol>
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
    </div>
  )
}
