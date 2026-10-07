'use client'

import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChoiceGroupProps {
  value: string | undefined
  onValueChange: (value: string) => void
  label: string
  children: React.ReactNode
  className?: string
}

/** Radio group rendered as selectable cards (arrow keys move between options). */
export function ChoiceGroup({ value, onValueChange, label, children, className }: ChoiceGroupProps) {
  return (
    <RadioGroupPrimitive.Root value={value} onValueChange={onValueChange} aria-label={label} className={cn('grid gap-3 sm:grid-cols-3', className)}>
      {children}
    </RadioGroupPrimitive.Root>
  )
}

export function ChoiceCard({ value, children, className }: { value: string; children: React.ReactNode; className?: string }) {
  return (
    <RadioGroupPrimitive.Item
      value={value}
      className={cn(
        'group relative flex w-full flex-col items-stretch gap-3 rounded-xl border bg-card p-4 text-left outline-none transition-[border-color,box-shadow,background-color]',
        'hover:border-primary/40 hover:bg-accent/40 focus-visible:ring-[3px] focus-visible:ring-ring/50',
        'data-[state=checked]:border-primary data-[state=checked]:bg-primary/[0.04] data-[state=checked]:ring-1 data-[state=checked]:ring-primary',
        className
      )}
    >
      {children}
      <span
        className="absolute right-3 top-3 flex size-5 items-center justify-center rounded-full border border-input bg-background transition-colors group-data-[state=checked]:border-primary group-data-[state=checked]:bg-primary"
        aria-hidden="true"
      >
        <Check className="size-3 text-primary-foreground opacity-0 transition-opacity group-data-[state=checked]:opacity-100" strokeWidth={3} />
      </span>
    </RadioGroupPrimitive.Item>
  )
}
