'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { useI18n } from '@/i18n/provider'
import { cn } from '@/lib/utils'

const TAG_MAX_LENGTH = 40

interface TagsInputProps {
  id: string
  value: string[]
  onChange: (tags: string[]) => void
  max?: number
  placeholder?: string
  invalid?: boolean
  describedBy?: string
}

/** Free-form tag entry: Enter or comma adds a chip, Backspace on an empty field removes the last one. */
export function TagsInput({ id, value, onChange, max = 15, placeholder, invalid, describedBy }: TagsInputProps) {
  const { t } = useI18n()
  const [draft, setDraft] = useState('')

  const add = (raw: string) => {
    const next = [...value]
    for (const part of raw.split(',')) {
      const tag = part.trim().slice(0, TAG_MAX_LENGTH)
      if (tag && next.length < max && !next.some((existing) => existing.toLowerCase() === tag.toLowerCase())) next.push(tag)
    }
    if (next.length !== value.length) onChange(next)
    setDraft('')
  }

  const remove = (tag: string) => onChange(value.filter((existing) => existing !== tag))

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault()
      if (draft.trim()) add(draft)
    } else if (event.key === 'Backspace' && !draft && value.length) {
      remove(value[value.length - 1])
    }
  }

  return (
    <div
      className={cn(
        'flex min-h-9 w-full flex-wrap items-center gap-1.5 rounded-md border border-input bg-transparent px-2 py-1.5 shadow-xs transition-[color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 dark:bg-input/30',
        invalid && 'border-destructive'
      )}
    >
      {value.map((tag) => (
        <span key={tag} className="inline-flex items-center gap-1 rounded-md bg-secondary py-0.5 pl-2 pr-1 text-xs font-medium text-secondary-foreground">
          {tag}
          <button
            type="button"
            onClick={() => remove(tag)}
            className="flex size-4 items-center justify-center rounded-sm text-muted-foreground hover:bg-background hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
            aria-label={t('library.form.removeTag', { tag })}
          >
            <X className="size-3" aria-hidden="true" />
          </button>
        </span>
      ))}
      <input
        id={id}
        value={draft}
        onChange={(event) => {
          const text = event.target.value
          if (text.includes(',')) add(text)
          else setDraft(text)
        }}
        onKeyDown={onKeyDown}
        onBlur={() => draft.trim() && add(draft)}
        placeholder={value.length < max ? placeholder : undefined}
        disabled={value.length >= max}
        aria-describedby={describedBy}
        aria-invalid={invalid || undefined}
        className="h-6 min-w-28 flex-1 bg-transparent px-1 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
      />
    </div>
  )
}
