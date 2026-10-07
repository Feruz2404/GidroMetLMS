'use client'

import { Award, BookOpen, Clock, Users, type LucideIcon } from 'lucide-react'
import { CourseCover } from '@/components/shared/category-icon'
import { UserAvatar } from '@/components/shared/user-avatar'
import { useI18n } from '@/i18n/provider'
import { personName } from '@/lib/utils'
import type { CourseDetailDto } from '@/shared/dto'
import { CourseActions } from './course-actions'

function Chip({ children, tone = 'glass' }: { children: React.ReactNode; tone?: 'glass' | 'amber' | 'solid' }) {
  const styles = {
    glass: 'bg-white/20 text-white backdrop-blur-sm',
    amber: 'bg-amber-400/95 font-semibold text-amber-950',
    solid: 'bg-white/90 font-semibold text-slate-900',
  }
  return <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${styles[tone]}`}>{children}</span>
}

function Meta({ icon: Icon, children }: { icon: LucideIcon; children: React.ReactNode }) {
  return (
    <li className="inline-flex items-center gap-1.5">
      <Icon className="size-4 opacity-80" aria-hidden="true" />
      {children}
    </li>
  )
}

export function CourseHero({ course }: { course: CourseDetailDto }) {
  const { t } = useI18n()
  return (
    <section className="overflow-hidden rounded-2xl border bg-card shadow-[var(--shadow-card)]">
      <CourseCover icon={course.category?.icon} seed={course.category?.slug ?? course.id} className="px-5 pb-10 pt-6 sm:px-8 sm:pb-12 sm:pt-8">
        <div className="flex flex-wrap items-center gap-2">
          <Chip>{course.category?.name ?? t('nav.courses')}</Chip>
          <Chip>{t(`level.${course.level}`)}</Chip>
          {course.isMandatory && <Chip tone="amber">{t('common.mandatory')}</Chip>}
          {course.status !== 'published' && <Chip tone="solid">{t(`status.${course.status}`)}</Chip>}
        </div>
        <h1 className="mt-4 max-w-3xl text-2xl font-semibold tracking-tight text-balance sm:text-[2rem] sm:leading-tight">{course.title}</h1>
        {course.shortSummary && <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/85 sm:text-base">{course.shortSummary}</p>}
        <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/95" aria-label={t('courses.detail.facts')}>
          <Meta icon={Clock}>{t('common.hours', { count: course.durationHours })}</Meta>
          <Meta icon={BookOpen}>{t('common.lessons', { count: course.lessonCount })}</Meta>
          <Meta icon={Users}>{t('common.learners', { count: course.enrollmentCount })}</Meta>
          {course.certificateEnabled && <Meta icon={Award}>{t('courses.detail.withCertificate')}</Meta>}
        </ul>
      </CourseCover>

      <div className="flex flex-col gap-4 px-5 py-4 sm:px-8 md:flex-row md:items-center md:justify-between">
        {course.tutor ? (
          <div className="flex min-w-0 items-center gap-3">
            <UserAvatar user={course.tutor} className="size-10" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">{t('courses.detail.tutor')}</p>
              <p className="truncate font-medium">{personName(course.tutor, true)}</p>
              {course.tutor.position && <p className="truncate text-xs text-muted-foreground">{course.tutor.position}</p>}
            </div>
          </div>
        ) : (
          <span aria-hidden="true" />
        )}
        <CourseActions course={course} />
      </div>
    </section>
  )
}
