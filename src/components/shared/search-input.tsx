'use client'

import { useEffect, useState } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { useI18n } from '@/i18n/provider'
import { cn } from '@/lib/utils'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  delayMs?: number
}

/** Debounced search box; `onChange` fires after typing pauses. */
export function SearchInput({ value, onChange, placeholder, className, delayMs = 350 }: SearchInputProps) {
  const { t } = useI18n()
  const [draft, setDraft] = useState(value)
  const [syncedValue, setSyncedValue] = useState(value)
  const debounced = useDebouncedValue(draft, delayMs)

  // Adopt external changes (e.g. "reset filters") without an extra effect pass.
  if (value !== syncedValue) {
    setSyncedValue(value)
    setDraft(value)
  }
  useEffect(() => {
    if (debounced !== value) onChange(debounced)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only react to the debounced draft
  }, [debounced])

  return (
    <div className={cn('relative', className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
      <Input
        type="search"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder={placeholder ?? t('common.searchPlaceholder')}
        aria-label={placeholder ?? t('action.search')}
        className="h-10 bg-card pl-9 pr-9 [&::-webkit-search-cancel-button]:hidden"
      />
      {draft && (
        <button
          type="button"
          onClick={() => setDraft('')}
          className="absolute right-2 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label={t('action.reset')}
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  )
}
