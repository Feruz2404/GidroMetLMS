'use client'

import { CheckCircle2, Info, ListChecks, Target } from 'lucide-react'
import { Markdown } from '@/components/shared/markdown'
import { SectionCard } from '@/components/shared/section-card'
import { useI18n } from '@/i18n/provider'
import type { CourseDetailDto } from '@/shared/dto'

export function CourseOverview({ course }: { course: CourseDetailDto }) {
  const { t } = useI18n()
  return (
    <div className="space-y-5">
      <SectionCard title={t('courses.overview.about')}>
        {course.description ? (
          <Markdown>{course.description}</Markdown>
        ) : (
          <p className="text-sm text-muted-foreground">{course.shortSummary ?? t('courses.overview.noDescription')}</p>
        )}
      </SectionCard>

      {course.learningOutcomes.length > 0 && (
        <SectionCard title={t('courses.overview.outcomes')}>
          <ul className="grid gap-x-6 gap-y-3 md:grid-cols-2">
            {course.learningOutcomes.map((outcome) => (
              <li key={outcome} className="flex gap-2.5 text-sm leading-relaxed">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
                <span>{outcome}</span>
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      {(course.prerequisites.length > 0 || course.targetAudience) && (
        <div className="grid gap-5 md:grid-cols-2">
          {course.prerequisites.length > 0 && (
            <SectionCard title={t('courses.overview.prerequisites')} className={course.targetAudience ? undefined : 'md:col-span-2'}>
              <ul className="space-y-2.5">
                {course.prerequisites.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm leading-relaxed">
                    <ListChecks className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </SectionCard>
          )}
          {course.targetAudience && (
            <SectionCard title={t('courses.overview.audience')} className={course.prerequisites.length > 0 ? undefined : 'md:col-span-2'}>
              <p className="flex gap-2.5 text-sm leading-relaxed">
                <Target className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                <span>{course.targetAudience}</span>
              </p>
            </SectionCard>
          )}
        </div>
      )}

      {course.generalTrainingNotice && (
        <p className="flex gap-2.5 rounded-lg border border-dashed bg-muted/40 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
          <Info className="mt-px size-4 shrink-0" aria-hidden="true" />
          <span>{course.generalTrainingNotice}</span>
        </p>
      )}
    </div>
  )
}
