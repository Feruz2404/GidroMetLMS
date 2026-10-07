'use client'

import { Award, BarChart3, CheckCircle2, LineChart, UserCheck, Users } from 'lucide-react'
import { ErrorState } from '@/components/shared/error-state'
import { StatCard } from '@/components/shared/stat-card'
import { ChartCard, ChartEmpty } from '@/features/dashboard/charts/chart-card'
import { useChartFormat } from '@/features/dashboard/charts/chart-format'
import type { ChartSeries } from '@/features/dashboard/charts/chart-tooltip'
import { ColumnChart, MultiLineChart, SERIES_COLOR } from '@/features/dashboard/charts/charts'
import { DashboardSkeleton } from '@/features/dashboard/components/dashboard-skeleton'
import { MetricStrip } from '@/features/dashboard/components/metric-strip'
import { useI18n } from '@/i18n/provider'
import type { ReportOverviewDto } from '@/shared/dto'
import { useReport } from '../api'

export function OverviewReport() {
  const { t, formatNumber } = useI18n()
  const query = useReport('overview')

  if (query.isPending) return <DashboardSkeleton />
  if (query.isError) return <ErrorState error={query.error} onRetry={() => query.refetch()} />

  const { totals } = query.data
  const percent = (value: number) => t('common.percent', { value: formatNumber(value) })

  return (
    <div className="space-y-6">
      <section aria-label={t('reports.kpi.title')} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label={t('reports.kpi.learners')} value={formatNumber(totals.learners)} icon={Users} />
          <StatCard label={t('reports.kpi.enrollments')} value={formatNumber(totals.enrollments)} icon={UserCheck} tone="cyan" />
          <StatCard
            label={t('reports.kpi.completionRate')}
            value={percent(totals.completionRate)}
            icon={CheckCircle2}
            tone="green"
            hint={t('reports.kpi.completedHint', { count: totals.completed })}
          />
          <StatCard label={t('reports.kpi.certificates')} value={formatNumber(totals.certificates)} icon={Award} tone="violet" />
        </div>
        <MetricStrip
          items={[
            { label: t('reports.kpi.courses'), value: formatNumber(totals.courses) },
            { label: t('reports.kpi.completed'), value: formatNumber(totals.completed) },
            { label: t('reports.kpi.attempts'), value: formatNumber(totals.attempts) },
            { label: t('reports.kpi.passRate'), value: percent(totals.passRate) },
            { label: t('reports.kpi.averageScore'), value: percent(totals.averageScore) },
            { label: t('reports.kpi.downloads'), value: formatNumber(totals.downloads) },
          ]}
        />
      </section>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <MonthlyTrend monthly={query.data.monthly} className="xl:col-span-2" />
        <ScoreDistribution distribution={query.data.scoreDistribution} />
      </div>
    </div>
  )
}

function MonthlyTrend({ monthly, className }: { monthly: ReportOverviewDto['monthly']; className?: string }) {
  const { t } = useI18n()
  const format = useChartFormat()
  const title = t('reports.trend.title')
  // Slots 2, 3 and 5 of the chart palette: the only trio that stays distinct
  // for colour-blind readers in both themes (validated all-pairs).
  const series: ChartSeries[] = [
    { key: 'enrollments', label: t('reports.series.enrollments'), color: 'var(--chart-2)' },
    { key: 'completions', label: t('reports.series.completions'), color: 'var(--chart-3)' },
    { key: 'certificates', label: t('reports.series.certificates'), color: 'var(--chart-5)' },
  ]
  const isEmpty = monthly.every((month) => month.enrollments + month.completions + month.certificates === 0)
  return (
    <ChartCard
      title={title}
      description={t('reports.trend.description')}
      className={className}
      height={280}
      legend={series}
      empty={isEmpty ? <ChartEmpty icon={LineChart} title={t('state.empty')} /> : undefined}
      table={{
        columns: [t('reports.trend.month'), ...series.map((item) => item.label)],
        rows: monthly.map((month) => ({
          key: month.month,
          cells: [format.monthLabel(month.month), format.number(month.enrollments), format.number(month.completions), format.number(month.certificates)],
        })),
      }}
    >
      <MultiLineChart data={monthly} xKey="month" series={series} title={title} formatTick={format.monthTick} formatLabel={format.monthLabel} />
    </ChartCard>
  )
}

function ScoreDistribution({ distribution }: { distribution: ReportOverviewDto['scoreDistribution'] }) {
  const { t } = useI18n()
  const format = useChartFormat()
  const title = t('reports.distribution.title')
  const label = t('reports.distribution.series')
  const rangeLabel = (range: string) => `${range}%`
  return (
    <ChartCard
      title={title}
      description={t('reports.distribution.description')}
      height={280}
      empty={distribution.every((bucket) => bucket.count === 0) ? <ChartEmpty icon={BarChart3} title={t('reports.distribution.empty')} /> : undefined}
      table={{
        columns: [t('reports.distribution.range'), label],
        rows: distribution.map((bucket) => ({ key: bucket.range, cells: [rangeLabel(bucket.range), format.number(bucket.count)] })),
      }}
    >
      <ColumnChart data={distribution} xKey="range" series={[{ key: 'count', label, color: SERIES_COLOR }]} title={title} formatLabel={rangeLabel} />
    </ChartCard>
  )
}
