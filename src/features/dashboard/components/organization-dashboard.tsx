'use client'

import Link from 'next/link'
import { Activity, Award, BarChart3, CheckCircle2, LineChart, Trophy, Users } from 'lucide-react'
import { DataTable, type Column } from '@/components/shared/data-table'
import { ProgressBar } from '@/components/shared/progress-bar'
import { SectionCard } from '@/components/shared/section-card'
import { StatCard } from '@/components/shared/stat-card'
import { useI18n } from '@/i18n/provider'
import { routes } from '@/lib/routes'
import type { OrganizationDashboardDto } from '@/shared/dto'
import { ChartCard, ChartEmpty } from '../charts/chart-card'
import { useChartFormat } from '../charts/chart-format'
import { AreaTrendChart, HorizontalBarChart, SERIES_COLOR } from '../charts/charts'
import { IconTile, LinkRow, ListEmpty, SeeAllLink } from './link-list'
import { MetricStrip } from './metric-strip'
import { SectionHeading } from './section-heading'

type DepartmentRow = OrganizationDashboardDto['departments'][number]

const UNASSIGNED = '—'

export function OrganizationDashboard({ data }: { data: OrganizationDashboardDto }) {
  const { t, formatNumber } = useI18n()
  const { stats } = data
  const percent = (value: number) => t('common.percent', { value: formatNumber(value) })

  return (
    <div className="space-y-8">
      <section aria-label={t('dashboard.kpi.title')} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label={t('dashboard.kpi.learners')} value={formatNumber(stats.learners)} icon={Users} />
          <StatCard
            label={t('dashboard.kpi.activeUsers')}
            value={formatNumber(stats.activeUsers30d)}
            icon={Activity}
            tone="cyan"
            hint={t('dashboard.kpi.last30Days')}
          />
          <StatCard
            label={t('dashboard.kpi.completionRate')}
            value={percent(stats.completionRate)}
            icon={CheckCircle2}
            tone="green"
            hint={t('dashboard.kpi.enrollmentsHint', { count: stats.enrollments })}
          />
          <StatCard label={t('dashboard.kpi.certificates')} value={formatNumber(stats.certificates)} icon={Award} tone="violet" />
        </div>
        <MetricStrip
          items={[
            { label: t('dashboard.kpi.instructors'), value: formatNumber(stats.instructors) },
            { label: t('dashboard.kpi.publishedCourses'), value: formatNumber(stats.publishedCourses) },
            { label: t('dashboard.kpi.enrollments'), value: formatNumber(stats.enrollments) },
            { label: t('dashboard.kpi.passRate'), value: percent(stats.passRate) },
            { label: t('dashboard.kpi.averageScore'), value: percent(stats.averageScore) },
            { label: t('dashboard.kpi.resources'), value: formatNumber(stats.resources) },
          ]}
        />
      </section>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <ActiveUsersChart activity={data.activity} className="xl:col-span-2" />
        <RecentCertificates certificates={data.recentCertificates} />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <CategoriesChart categories={data.enrollmentsByCategory} />
        <TopCourses courses={data.topCourses} />
      </div>

      {data.departments.length > 1 && <Departments departments={data.departments} />}
    </div>
  )
}

function ActiveUsersChart({ activity, className }: { activity: OrganizationDashboardDto['activity']; className?: string }) {
  const { t } = useI18n()
  const format = useChartFormat()
  const label = t('dashboard.activeUsers.series')
  const title = t('dashboard.activeUsers.title')
  const isEmpty = activity.every((point) => point.value === 0)
  return (
    <ChartCard
      title={title}
      description={t('dashboard.activeUsers.description')}
      className={className}
      height={260}
      empty={isEmpty ? <ChartEmpty icon={LineChart} title={t('state.empty')} /> : undefined}
      table={{
        columns: [t('common.date'), label],
        rows: activity.map((point) => ({ key: point.date, cells: [format.dayLabel(point.date), format.number(point.value)] })),
      }}
    >
      <AreaTrendChart
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

function CategoriesChart({ categories }: { categories: OrganizationDashboardDto['enrollmentsByCategory'] }) {
  const { t } = useI18n()
  const format = useChartFormat()
  const label = t('dashboard.kpi.enrollments')
  const title = t('dashboard.categories.title')
  return (
    <ChartCard
      title={title}
      description={t('dashboard.categories.description')}
      height={Math.max(160, categories.length * 36)}
      empty={categories.length === 0 ? <ChartEmpty icon={BarChart3} title={t('state.empty')} /> : undefined}
      table={{
        columns: [t('common.category'), label],
        rows: categories.map((category) => ({ key: category.name, cells: [category.name, format.number(category.value)] })),
      }}
    >
      <HorizontalBarChart data={categories} series={{ key: 'value', label, color: SERIES_COLOR }} title={title} />
    </ChartCard>
  )
}

function TopCourses({ courses }: { courses: OrganizationDashboardDto['topCourses'] }) {
  const { t } = useI18n()
  return (
    <SectionCard title={t('dashboard.topCourses.title')} description={t('dashboard.topCourses.description')}>
      {courses.length === 0 ? (
        <ListEmpty icon={Trophy}>{t('state.empty')}</ListEmpty>
      ) : (
        <ol className="space-y-4">
          {courses.map((course, index) => (
            <li key={course.id} className="flex items-start gap-3">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold tabular-nums text-muted-foreground">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <Link href={routes.course(course.id)} className="max-w-full truncate text-sm font-medium hover:text-primary focus-visible:underline focus-visible:outline-none">
                    {course.title}
                  </Link>
                  <span className="shrink-0 text-xs tabular-nums text-muted-foreground">{t('common.learners', { count: course.enrollments })}</span>
                </div>
                <div className="flex items-center gap-3">
                  <ProgressBar value={course.completionRate} size="sm" className="flex-1" />
                  <span className="shrink-0 text-xs tabular-nums text-muted-foreground">{t('dashboard.topCourses.completion', { value: course.completionRate })}</span>
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </SectionCard>
  )
}

function RecentCertificates({ certificates }: { certificates: OrganizationDashboardDto['recentCertificates'] }) {
  const { t, formatDate } = useI18n()
  return (
    <SectionCard
      title={t('dashboard.recentCertificates.title')}
      action={certificates.length > 0 && <SeeAllLink href={routes.certificates} label={t('action.seeAll')} />}
    >
      {certificates.length === 0 ? (
        <ListEmpty icon={Award}>{t('dashboard.recentCertificates.empty')}</ListEmpty>
      ) : (
        <ul>
          {certificates.map((certificate) => (
            <LinkRow
              key={certificate.id}
              href={routes.certificate(certificate.id)}
              leading={<IconTile icon={Award} tone="violet" />}
              title={certificate.recipientName}
              meta={certificate.courseTitle}
              trailing={<span className="text-xs text-muted-foreground">{formatDate(certificate.issuedAt, 'medium')}</span>}
            />
          ))}
        </ul>
      )}
    </SectionCard>
  )
}

function Departments({ departments }: { departments: DepartmentRow[] }) {
  const { t, formatNumber } = useI18n()
  const columns: Column<DepartmentRow>[] = [
    {
      key: 'name',
      header: t('common.department'),
      // The API groups learners without a department under "—".
      cell: (row) => (
        <div className="min-w-40 whitespace-normal">
          {row.name === UNASSIGNED ? (
            <span className="text-muted-foreground">{t('dashboard.departments.unassigned')}</span>
          ) : (
            <span className="font-medium">{row.name}</span>
          )}
          <span className="block text-xs text-muted-foreground md:hidden">{t('common.learners', { count: row.learners })}</span>
        </div>
      ),
    },
    {
      key: 'learners',
      header: t('dashboard.kpi.learners'),
      cell: (row) => formatNumber(row.learners),
      className: 'text-right tabular-nums',
      hideOnMobile: true,
    },
    {
      key: 'completion',
      header: t('dashboard.kpi.completionRate'),
      cell: (row) => <ProgressBar value={row.completionRate} showLabel className="min-w-28" />,
      className: 'w-[34%]',
    },
  ]
  return (
    <section aria-labelledby="dashboard-departments">
      <SectionHeading
        id="dashboard-departments"
        title={t('dashboard.departments.title')}
        description={t('dashboard.departments.description')}
        action={<SeeAllLink href={`${routes.reports}?tab=learners`} label={t('nav.reports')} />}
      />
      <DataTable columns={columns} rows={departments} rowKey={(row) => row.name} />
    </section>
  )
}
