'use client'

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useChartFormat } from './chart-format'
import { ChartTooltipContent, type ChartSeries } from './chart-tooltip'

// Shared mark and chrome specs: recessive hairline grid, no axis rules,
// muted tick text, 2px lines, bars capped at 24px with 4px rounded data ends.
const TICK = { fill: 'var(--muted-foreground)', fontSize: 12 }
const MARGIN = { top: 8, right: 8, bottom: 0, left: -12 }
const BAR_CURSOR = { fill: 'var(--muted)', fillOpacity: 0.7 }
const LINE_CURSOR = { stroke: 'var(--muted-foreground)', strokeOpacity: 0.35, strokeWidth: 1 }
const ACTIVE_DOT = { r: 4, stroke: 'var(--card)', strokeWidth: 2 }

export const SERIES_COLOR = 'var(--chart-1)'

interface CartesianChartProps<T extends object> {
  data: T[]
  /** Category / time key on the x axis. */
  xKey: keyof T & string
  series: ChartSeries[]
  /** Accessible name of the plot. */
  title: string
  formatTick?: (value: string) => string
  formatLabel?: (value: string) => string
}

function Grid() {
  return <CartesianGrid vertical={false} stroke="var(--border)" />
}

/** Columns for one series over discrete buckets (days, score ranges). */
export function ColumnChart<T extends object>({ data, xKey, series, title, formatTick, formatLabel }: CartesianChartProps<T>) {
  const format = useChartFormat()
  const [main] = series
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={MARGIN} barCategoryGap="22%" accessibilityLayer title={title}>
        <Grid />
        <XAxis
          dataKey={xKey}
          tickFormatter={formatTick}
          tick={TICK}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={8}
          interval={data.length <= 8 ? 0 : 'preserveStartEnd'}
        />
        <YAxis allowDecimals={false} tickFormatter={format.number} tick={TICK} tickLine={false} axisLine={false} width={40} />
        <Tooltip
          cursor={BAR_CURSOR}
          content={(props) => <ChartTooltipContent {...props} series={series} formatLabel={formatLabel ?? String} formatValue={format.number} />}
        />
        <Bar dataKey={main.key} name={main.label} fill={main.color} radius={[4, 4, 0, 0]} maxBarSize={24} activeBar={{ fillOpacity: 0.8 }} />
      </BarChart>
    </ResponsiveContainer>
  )
}

/** One series as a line with a light wash beneath it. */
export function AreaTrendChart<T extends object>({ data, xKey, series, title, formatTick, formatLabel }: CartesianChartProps<T>) {
  const format = useChartFormat()
  const [main] = series
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={MARGIN} accessibilityLayer title={title}>
        <Grid />
        <XAxis dataKey={xKey} tickFormatter={formatTick} tick={TICK} tickLine={false} axisLine={false} tickMargin={8} minTickGap={24} />
        <YAxis allowDecimals={false} tickFormatter={format.number} tick={TICK} tickLine={false} axisLine={false} width={40} />
        <Tooltip
          cursor={LINE_CURSOR}
          content={(props) => <ChartTooltipContent {...props} series={series} formatLabel={formatLabel ?? String} formatValue={format.number} />}
        />
        <Area
          type="linear"
          dataKey={main.key}
          name={main.label}
          stroke={main.color}
          strokeWidth={2}
          fill={main.color}
          fillOpacity={0.1}
          dot={false}
          activeDot={ACTIVE_DOT}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

/** Two or more series on one shared axis. */
export function MultiLineChart<T extends object>({ data, xKey, series, title, formatTick, formatLabel }: CartesianChartProps<T>) {
  const format = useChartFormat()
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={MARGIN} accessibilityLayer title={title}>
        <Grid />
        <XAxis dataKey={xKey} tickFormatter={formatTick} tick={TICK} tickLine={false} axisLine={false} tickMargin={8} minTickGap={16} />
        <YAxis allowDecimals={false} tickFormatter={format.number} tick={TICK} tickLine={false} axisLine={false} width={40} />
        <Tooltip
          cursor={LINE_CURSOR}
          content={(props) => <ChartTooltipContent {...props} series={series} formatLabel={formatLabel ?? String} formatValue={format.number} />}
        />
        {series.map((item) => (
          <Line
            key={item.key}
            type="monotone"
            dataKey={item.key}
            name={item.label}
            stroke={item.color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            dot={false}
            activeDot={ACTIVE_DOT}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

interface HorizontalBarChartProps {
  data: Array<{ name: string; value: number }>
  series: ChartSeries
  title: string
}

const LABEL_WIDTH = 148
const MAX_LABEL_CHARS = 21

/** Ranked categories with long names: bars grow right, value at the tip. */
export function HorizontalBarChart({ data, series, title }: HorizontalBarChartProps) {
  const format = useChartFormat()
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 36, bottom: 0, left: 0 }} barCategoryGap="28%" accessibilityLayer title={title}>
        <XAxis type="number" hide allowDecimals={false} />
        <YAxis type="category" dataKey="name" width={LABEL_WIDTH} tickLine={false} axisLine={false} tick={<CategoryTick />} interval={0} />
        <Tooltip
          cursor={BAR_CURSOR}
          content={(props) => <ChartTooltipContent {...props} series={[series]} formatLabel={String} formatValue={format.number} />}
        />
        <Bar dataKey="value" name={series.label} fill={series.color} radius={[0, 4, 4, 0]} maxBarSize={20} activeBar={{ fillOpacity: 0.8 }}>
          <LabelList dataKey="value" position="right" offset={8} fill="var(--foreground)" fontSize={12} formatter={(value: number) => format.number(value)} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

/** Y-axis category label, truncated to the label column; the full name stays in a <title>. */
function CategoryTick({ x, y, payload }: { x?: number; y?: number; payload?: { value: string } }) {
  const name = payload?.value ?? ''
  const short = name.length > MAX_LABEL_CHARS ? `${name.slice(0, MAX_LABEL_CHARS - 1).trimEnd()}…` : name
  return (
    <text x={x} y={y} dy={4} textAnchor="end" fill="var(--muted-foreground)" fontSize={12}>
      <title>{name}</title>
      {short}
    </text>
  )
}
