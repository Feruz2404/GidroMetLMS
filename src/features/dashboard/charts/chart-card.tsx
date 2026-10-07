'use client'

import { useState } from 'react'
import { BarChart3, Table2, type LucideIcon } from 'lucide-react'
import { SectionCard } from '@/components/shared/section-card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useI18n } from '@/i18n/provider'
import { cn } from '@/lib/utils'
import { ChartLegend, type ChartSeries } from './chart-tooltip'

export interface ChartTableData {
  columns: string[]
  rows: Array<{ key: string; cells: React.ReactNode[] }>
}

interface ChartCardProps {
  title: string
  description?: string
  /** Same data as the chart, reachable without hovering (and for screen readers). */
  table: ChartTableData
  /** Shown above the plot when the chart has two or more series. */
  legend?: ChartSeries[]
  /** Replaces the chart when there is nothing meaningful to plot. */
  empty?: React.ReactNode
  /** Plot height in px, including the axis band. */
  height: number
  action?: React.ReactNode
  className?: string
  children: React.ReactNode
}

/** Section card around a chart, with a chart ↔ table toggle. */
export function ChartCard({ title, description, table, legend, empty, height, action, className, children }: ChartCardProps) {
  const { t } = useI18n()
  const [showTable, setShowTable] = useState(false)
  const toggleLabel = showTable ? t('dashboard.chart.showChart') : t('dashboard.chart.showTable')

  return (
    <SectionCard
      title={title}
      description={description}
      className={cn('flex flex-col', className)}
      contentClassName="flex flex-1 flex-col"
      action={
        <div className="flex items-center gap-1">
          {action}
          {!empty && (
            <Button variant="ghost" size="icon-sm" aria-pressed={showTable} aria-label={toggleLabel} title={toggleLabel} onClick={() => setShowTable((value) => !value)}>
              {showTable ? <BarChart3 aria-hidden="true" /> : <Table2 aria-hidden="true" />}
            </Button>
          )}
        </div>
      }
    >
      {empty ?? (
        <>
          {legend && legend.length > 1 && !showTable && <ChartLegend series={legend} />}
          {/* The plot is absolutely positioned so it fills a card stretched by its grid row
              without its own SVG size ever holding the card open. */}
          <div className="relative flex-1" style={{ minHeight: height }}>
            <div className="absolute inset-0">{showTable ? <ChartDataTable table={table} /> : children}</div>
          </div>
        </>
      )}
    </SectionCard>
  )
}

function ChartDataTable({ table }: { table: ChartTableData }) {
  return (
    <div className="h-full overflow-auto rounded-lg border scrollbar-thin">
      <Table>
        <TableHeader className="sticky top-0 bg-muted">
          <TableRow className="hover:bg-transparent">
            {table.columns.map((column, index) => (
              <TableHead key={column} className={cn('h-9 text-xs font-semibold text-muted-foreground', index > 0 && 'text-right')}>
                {column}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {table.rows.map((row) => (
            <TableRow key={row.key}>
              {row.cells.map((cell, index) => (
                <TableCell key={index} className={cn('py-2', index > 0 && 'text-right tabular-nums')}>
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

/** Compact empty message sized like a small chart. */
export function ChartEmpty({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description?: string }) {
  return (
    <div className="flex h-full min-h-48 flex-col items-center justify-center gap-2 rounded-lg border border-dashed px-4 py-8 text-center">
      <span className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <p className="text-sm font-medium">{title}</p>
      {description && <p className="max-w-xs text-xs text-muted-foreground">{description}</p>}
    </div>
  )
}
