'use client'

import Link from 'next/link'
import { BookOpen, CheckCircle2, ClipboardCheck, GraduationCap, LineChart, Plus, Target, Users, UserCheck, XCircle } from 'lucide-react'
import { DataTable, type Column } from '@/components/shared/data-table'
import { EmptyState } from '@/components/shared/empty-state'
import { ProgressBar } from '@/components/shared/progress-bar'
import { SectionCard } from '@/components/shared/section-card'
import { StatCard } from '@/components/shared/stat-card'
import { StatusBadge } from '@/components/shared/status-badge'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/i18n/provider'
import { routes } from '@/lib/routes'
import type { InstructorDashboardDto } from '@/shared/dto'
import { ChartCard, ChartEmpty } from '../charts/chart-card'
import { useChartFormat } from '../charts/chart-format'
import { ColumnChart, SERIES_COLOR } from '../charts/charts'
import { IconTile, LinkRow, ListEmpty, SeeAllLink } from './link-list'
import { SectionHeading } from './section-heading'

type CourseRow = InstructorDashboardDto['courses'][number]

export function InstructorDashboard({ data }: { data: InstructorDashboardDto }) {
  const { t, formatNumber } = useI18n()
  const { stats } = data
  const percent = (value: number) => t('common.percent', { value: formatNumber(value) })

  return (
    <div className="space-y-8">
      <section aria-label={t('dashboard.kpi.title')} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label={t('dashboard.kpi.myCourses')}
          value={formatNumber(stats.courses)}
          icon={BookOpen}
          hint={t('dashboard.kpi.publishedHint', { count: stats.publishedCourses })}
        />
        <StatCard label={t('dashboard.kpi.learners')} value={formatNumber(stats.learners)} icon={Users} tone="cyan" />
        <StatCard label={t('dashboard.kpi.enrollments')} value={formatNumber(stats.enrollments)} icon={UserCheck} tone="violet" />
        <StatCard label={t('dashboard.kpi.completionRate')} value={percent(stats.completionRate)} icon={CheckCircle2} tone="green" />
        <StatCard label={t('dashboard.kpi.averageScore')} value={percent(stats.averageScore)} icon={Target} tone="amber" />
        <StatCard label={t('dashboard.kpi.quizzes')} value={formatNumber(stats.quizzes)} icon={ClipboardCheck} />
      </section>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <ActivityChart activity={data.activity} className="xl:col-span-2" />
        <RecentAttempts attempts={data.recentAttempts} />
      </div>

      <CoursePerformance courses={data.courses} />
    </div>
  )
}

function ActivityChart({ activity, className }: { activity: InstructorDashboardDto['activity']; className?: string }) {
  const { t } = useI18n()
  const format = useChartFormat()
  const label = t('dashboard.activity.lessons')
  const title = t('dashboard.activity.instructorTitle')
  const isEmpty = activity.every((point) => point.value === 0)
  return (
    <ChartCard
      title={title}
      description={t('dashboard.activity.instructorDescription')}
      className={className}
      height={260}
      empty={isEmpty ? <ChartEmpty icon={LineChart} title={t('dashboard.activity.instructorEmpty')} /> : undefined}
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

function RecentAttempts({ attempts }: { attempts: InstructorDashboardDto['recentAttempts'] }) {
  const { t, formatRelative } = useI18n()
  return (
    <SectionCard
      title={t('dashboard.attempts.title')}
      action={attempts.length > 0 && <SeeAllLink href={`${routes.reports}?tab=assessments`} label={t('action.seeAll')} />}
    >
      {attempts.length === 0 ? (
        <ListEmpty icon={ClipboardCheck}>{t('dashboard.attempts.empty')}</ListEmpty>
      ) : (
        <ul>
          {attempts.map((attempt) => (
            <LinkRow
              key={attempt.attemptId}
              href={routes.attempt(attempt.attemptId)}
              leading={<IconTile icon={attempt.passed ? CheckCircle2 : XCircle} tone={attempt.passed ? 'green' : 'red'} />}
              title={attempt.learnerName}
              meta={`${attempt.quizTitle} · ${formatRelative(attempt.submittedAt)}`}
              trailing={
                <span className="text-right">
                  <span className="block text-sm font-semibold tabular-nums">{t('common.percent', { value: attempt.percentage })}</span>
                  <span className="block text-xs text-muted-foreground">{t(attempt.passed ? 'status.passed' : 'status.failed')}</span>
                </span>
              }
            />
          ))}
        </ul>
      )}
    </SectionCard>
  )
}

function CoursePerformance({ courses }: { courses: CourseRow[] }) {
  const { t, formatNumber } = useI18n()

  const columns: Column<CourseRow>[] = [
    {
      key: 'title',
      header: t('dashboard.column.course'),
      cell: (course) => (
        <Link href={routes.course(course.id)} className="line-clamp-2 min-w-48 whitespace-normal font-medium hover:text-primary focus-visible:underline focus-visible:outline-none">
          {course.title}
        </Link>
      ),
    },
    { key: 'status', header: t('common.status'), cell: (course) => <StatusBadge status={course.status} />, hideOnMobile: true },
    { key: 'enrollments', header: t('dashboard.column.enrollments'), cell: (course) => formatNumber(course.enrollments), className: 'text-right tabular-nums' },
    {
      key: 'completion',
      header: t('dashboard.column.completionRate'),
      cell: (course) => <ProgressBar value={course.completionRate} showLabel className="min-w-32" />,
      className: 'w-[22%]',
    },
    {
      key: 'progress',
      header: t('dashboard.column.averageProgress'),
      cell: (course) => t('common.percent', { value: course.averageProgress }),
      className: 'text-right tabular-nums',
      hideOnMobile: true,
    },
  ]

  return (
    <section aria-labelledby="dashboard-course-performance">
      <SectionHeading
        id="dashboard-course-performance"
        title={t('dashboard.coursePerformance.title')}
        description={t('dashboard.coursePerformance.description')}
        action={courses.length > 0 && <SeeAllLink href={`${routes.reports}?tab=courses`} label={t('nav.reports')} />}
      />
      {courses.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title={t('dashboard.coursePerformance.emptyTitle')}
          description={t('dashboard.coursePerformance.emptyHint')}
          action={
            <Button asChild>
              <Link href={routes.newCourse}>
                <Plus aria-hidden="true" />
                {t('dashboard.action.newCourse')}
              </Link>
            </Button>
          }
        />
      ) : (
        <DataTable columns={columns} rows={courses} rowKey={(course) => course.id} />
      )}
    </section>
  )
}
