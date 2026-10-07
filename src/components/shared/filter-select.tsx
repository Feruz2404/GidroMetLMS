'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'

export interface FilterOption {
  value: string
  label: string
}

const ALL = '__all__'

interface FilterSelectProps {
  value: string
  onChange: (value: string) => void
  options: FilterOption[]
  /** Label of the "no filter" option; omit to make a choice mandatory. */
  allLabel?: string
  placeholder?: string
  className?: string
  ariaLabel: string
}

/** Select bound to a string filter where '' means "all". */
export function FilterSelect({ value, onChange, options, allLabel, placeholder, className, ariaLabel }: FilterSelectProps) {
  return (
    <Select value={value || (allLabel ? ALL : undefined)} onValueChange={(next) => onChange(next === ALL ? '' : next)}>
      <SelectTrigger className={cn('h-10 w-full bg-card sm:w-48', className)} aria-label={ariaLabel}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {allLabel && <SelectItem value={ALL}>{allLabel}</SelectItem>}
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
