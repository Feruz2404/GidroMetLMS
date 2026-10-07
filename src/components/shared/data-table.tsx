'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'

export interface Column<T> {
  key: string
  header: React.ReactNode
  cell: (row: T) => React.ReactNode
  className?: string
  /** Hide on small screens. */
  hideOnMobile?: boolean
}

interface DataTableProps<T> {
  columns: Column<T>[]
  rows: T[] | undefined
  rowKey: (row: T) => string
  loading?: boolean
  empty?: React.ReactNode
  onRowClick?: (row: T) => void
  className?: string
}

export function DataTable<T>({ columns, rows, rowKey, loading, empty, onRowClick, className }: DataTableProps<T>) {
  const responsive = (column: Column<T>) => cn(column.hideOnMobile && 'hidden md:table-cell', column.className)
  return (
    <div className={cn('overflow-hidden rounded-xl border bg-card shadow-[var(--shadow-card)]', className)}>
      <div className="overflow-x-auto scrollbar-thin">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent">
              {columns.map((column) => (
                <TableHead key={column.key} className={cn('h-11 text-xs font-semibold uppercase tracking-wide text-muted-foreground', responsive(column))}>
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? Array.from({ length: 6 }, (_, index) => (
                  <TableRow key={index}>
                    {columns.map((column) => (
                      <TableCell key={column.key} className={responsive(column)}>
                        <Skeleton className="h-4 w-full max-w-40" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : rows?.map((row) => (
                  <TableRow
                    key={rowKey(row)}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    className={cn(onRowClick && 'cursor-pointer')}
                  >
                    {columns.map((column) => (
                      <TableCell key={column.key} className={cn('py-3', responsive(column))}>
                        {column.cell(row)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>
      {!loading && rows?.length === 0 && empty && <div className="border-t p-4">{empty}</div>}
    </div>
  )
}
