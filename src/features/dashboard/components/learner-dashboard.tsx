'use client'

import Link from 'next/link'
import { Award, BookOpen, CalendarClock, CheckCircle2, Clock, Compass, GraduationCap, LineChart, PlayCircle, XCircle } from 'lucide-react'
import { EmptyState } from '@/components/shared/empty-state'
import { ProgressBar } from '@/components/shared/progress-bar'
import { SectionCard } from '@/components/shared/section-card'
import { StatCard } from '@/components/shared/stat-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CourseCard } from '@/features/courses/components/course-card'
import { useI18n } from '@/i18n/provider'
import { routes } from '@/lib/routes'
import { cn } from '@/lib/utils'
import type { LearnerDashboardDto } from '@/shared/dto'
import { ChartCard, ChartEmpty } from '../charts/chart-card'
import { useChartFormat } from '../charts/chart-format'
import { ColumnChart, SERIES_COLOR } from '../charts/charts'
import { DAY_MS, useNow } from '../use-now'
import { IconTile, LinkRow, ListEmpty, SeeAllLink } from './link-list'
import { SectionHeading } from './section-heading'

export function LearnerDashboard({ data }: { data: LearnerDashboardDto }) {
  const { t, formatNumber } = useI18n()
  const { stats } = data

  return (
    <div className="space-y-8">
      <section aria-label={t('dashboard.kpi.title')} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard
          label={t('dashboard.kpi.enrolled')}
          value={formatNumber(stats.enrolled)}
          icon={BookOpen}
          hint={t('dashboard.kpi.averageProgress', { value: stats.averageProgress })}
        />
        <StatCard label={t('dashboard.kpi.inProgress')} value={formatNumber(stats.inProgress)} icon={PlayCircle} tone="cyan" />
        <StatCard label={t('dashboard.kpi.completed')} value={formatNumber(stats.completed)} icon={CheckCircle2} tone="green" />
        <StatCard label={t('dashboard.kpi.certificates')} value={formatNumber(stats.certificates)} icon={Award} tone="violet" />
        <StatCard
          label={t('dashboard.kpi.studyHours')}
          value={formatNumber(stats.studyMinutes / 60, { maximumFractionDigits: 1 })}
          icon={Clock}
          tone="amber"
          className="sm:col-span-2 lg:col-span-1"
        />
      </section>

      {stats.enrolled === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title={t('dashboard.noEnrollments.title')}
          description={t('dashboard.noEnrollments.hint')}
          action={
            <Button asChild>
              <Link href={routes.courses}>
                <Compass aria-hidden="true" />
                {t('dashboard.browseCatalog')}
              </Link>
            </Button>
          }
        />
      ) : (
        <ContinueLearning courses={data.continueLearning} />
      )}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <ActivityChart activity={data.activity} className="xl:col-span-2" />
        <Deadlines deadlines={data.deadlines} />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <RecentResults results={data.recentResults} />
        <Certificates certificates={data.certificates} />
      </div>

      {data.recommended.length > 0 && (
        <section aria-labelledby="dashboard-recommended">
          <SectionHeading
            id="dashboard-recommended"
            title={t('dashboard.recommended.title')}
            description={t('dashboard.recommended.description')}
            action={<SeeAllLink href={routes.courses} label={t('action.seeAll')} />}
          />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {data.recommended.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function ContinueLearning({ courses }: { courses: LearnerDashboardDto['continueLearning'] }) {
  const { t } = useI18n()
  return (
    <section aria-labelledby="dashboard-continue">
      <SectionHeading
        id="dashboard-continue"
        title={t('dashboard.continue.title')}
        description={t('dashboard.continue.description')}
        action={<SeeAllLink href={`${routes.courses}?view=enrolled`} label={t('action.seeAll')} />}
      />
      {courses.length === 0 ? (
        <EmptyState
          compact
          icon={CheckCircle2}
          title={t('dashboard.continue.emptyTitle')}
          description={t('dashboard.continue.emptyHint')}
          action={
            <Button asChild variant="outline" size="sm">
              <Link href={routes.courses}>{t('dashboard.browseCatalog')}</Link>
            </Button>
          }
        />
      ) : (
        <div className={cn('grid grid-cols-1 gap-5 sm:grid-cols-2', courses.length > 3 ? 'xl:grid-cols-4' : 'xl:grid-cols-3')}>
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} nextLessonId={course.nextLessonId} />
          ))}
        </div>
      )}
    </section>
  )
}

function Deadlines({ deadlines }: { deadlines: LearnerDashboardDto['deadlines'] }) {
  const { t, formatDate } = useI18n()
  const now = useNow()
  return (
    <SectionCard title={t('dashboard.deadlines.title')}>
      {deadlines.length === 0 ? (
        <ListEmpty icon={CalendarClock}>{t('dashboard.deadlines.empty')}</ListEmpty>
      ) : (
        <ul className="divide-y">
          {deadlines.map((deadline) => {
            const daysLeft = now === null ? null : Math.ceil((new Date(deadline.deadlineAt).getTime() - now) / DAY_MS)
            const overdue = daysLeft !== null && daysLeft < 0
            return (
              <li key={deadline.courseId} className="space-y-2 py-3 first:pt-0 last:pb-0">
                <div className="flex items-start justify-between gap-3">
                  <Link href={routes.course(deadline.courseId)} className="line-clamp-2 min-w-0 text-sm font-medium hover:text-primary focus-visible:underline focus-visible:outline-none">
                    {deadline.title}
                  </Link>
                  {daysLeft !== null && <DaysLeftBadge days={daysLeft} />}
                </div>
                <p className={cn('text-xs', overdue ? 'font-medium text-destructive' : 'text-muted-foreground')}>
                  {t('dashboard.deadlines.due', { date: formatDate(deadline.deadlineAt, 'long') })}
                </p>
                <ProgressBar value={deadline.progress} size="sm" showLabel />
              </li>
            )
          })}
        </ul>
      )}
    </SectionCard>
  )
}

function DaysLeftBadge({ days }: { days: number }) {
  const { t } = useI18n()
  if (days < 0) return <Badge variant="destructive">{t('dashboard.deadlines.overdue')}</Badge>
  if (days === 0) return <Badge variant="warning">{t('dashboard.deadlines.today')}</Badge>
  return <Badge variant={days <= 7 ? 'warning' : 'muted'}>{t('dashboard.deadlines.daysLeft', { count: days })}</Badge>
}

function Certificates({ certificates }: { certificates: LearnerDashboardDto['certificates'] }) {
  const { t, formatDate } = useI18n()
  return (
    <SectionCard title={t('dashboard.certificates.title')} action={certificates.length > 0 && <SeeAllLink href={routes.certificates} label={t('action.seeAll')} />}>
      {certificates.length === 0 ? (
        <ListEmpty icon={Award}>{t('dashboard.certificates.empty')}</ListEmpty>
      ) : (
        <ul>
          {certificates.map((certificate) => (
            <LinkRow
              key={certificate.id}
              href={routes.certificate(certificate.id)}
              leading={<IconTile icon={Award} tone="violet" />}
              title={certificate.courseTitle}
              meta={`${certificate.certNumber} · ${formatDate(certificate.issuedAt, 'medium')}`}
            />
          ))}
        </ul>
      )}
    </SectionCard>
  )
}

function ActivityChart({ activity, className }: { activity: LearnerDashboardDto['activity']; className?: string }) {
  const { t } = useI18n()
  const format = useChartFormat()
  const label = t('dashboard.activity.lessons')
  const title = t('dashboard.activity.learnerTitle')
  const isEmpty = activity.every((point) => point.value === 0)
  return (
    <ChartCard
      title={title}
      description={t('dashboard.activity.learnerDescription')}
      className={className}
      height={240}
      empty={isEmpty ? <ChartEmpty icon={LineChart} title={t('dashboard.activity.emptyTitle')} description={t('dashboard.activity.emptyHint')} /> : undefined}
      table={{
        columns: [t('common.date'), label],
        rows: activity.map((point) => ({ key: point.date, cells: [format.dayLabel(point.date), format.number(point.value)] })),
      }}
    >
      <ColumnChart
        data={activity}
        xKey="date"
        series={[{ key: 'value', label, color: SERIES_COLOR }]}
        title={title}
        formatTick={format.dayTick}
        formatLabel={format.dayLabel}
      />
    </ChartCard>
  )
}

function RecentResults({ results }: { results: LearnerDashboardDto['recentResults'] }) {
  const { t, formatRelative } = useI18n()
  return (
    <SectionCard title={t('dashboard.results.title')} action={results.length > 0 && <SeeAllLink href={routes.quizzes} label={t('action.seeAll')} />}>
      {results.length === 0 ? (
        <ListEmpty icon={CheckCircle2}>{t('dashboard.results.empty')}</ListEmpty>
      ) : (
        <ul>
          {results.map((result) => (
            <LinkRow
              key={result.attemptId}
              href={routes.attempt(result.attemptId)}
              leading={<IconTile icon={result.passed ? CheckCircle2 : XCircle} tone={result.passed ? 'green' : 'red'} />}
              title={result.quizTitle}
              meta={`${t(result.passed ? 'status.passed' : 'status.failed')} · ${formatRelative(result.submittedAt)}`}
              trailing={<span className="text-sm font-semibold tabular-nums">{t('common.percent', { value: result.percentage })}</span>}
            />
          ))}
        </ul>
      )}
    </SectionCard>
  )
}
