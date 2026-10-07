'use client'

import { useRef } from 'react'
import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useI18n } from '@/i18n/provider'

export interface ListItem {
  key: string
  text: string
}

export const MAX_LIST_ITEMS = 20

let keySequence = 0
const newKey = () => `new-${(keySequence += 1)}`

export function toListItems(values: string[]): ListItem[] {
  return values.map((text, index) => ({ key: `item-${index}`, text }))
}

export function fromListItems(items: ListItem[]): string[] {
  return items.map((item) => item.text.trim()).filter(Boolean)
}

interface ListEditorProps {
  id: string
  items: ListItem[]
  onChange: (items: ListItem[]) => void
  placeholder: string
  addLabel: string
}

/** Editable list of short lines (outcomes, prerequisites). */
export function ListEditor({ id, items, onChange, placeholder, addLabel }: ListEditorProps) {
  const { t } = useI18n()
  const listRef = useRef<HTMLOListElement>(null)

  const add = () => {
    onChange([...items, { key: newKey(), text: '' }])
    requestAnimationFrame(() => listRef.current?.querySelector<HTMLInputElement>('li:last-child input')?.focus())
  }

  return (
    <div className="space-y-2">
      {items.length > 0 && (
        <ol ref={listRef} className="space-y-2">
          {items.map((item, index) => (
            <li key={item.key} className="flex items-center gap-2">
              <span className="w-5 shrink-0 text-right text-xs tabular-nums text-muted-foreground">{index + 1}.</span>
              <Input
                id={index === 0 ? id : undefined}
                value={item.text}
                maxLength={300}
                placeholder={placeholder}
                aria-label={`${placeholder} ${index + 1}`}
                onChange={(event) => onChange(items.map((current) => (current.key === item.key ? { ...current, text: event.target.value } : current)))}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault()
                    if (items.length < MAX_LIST_ITEMS) add()
                  }
                }}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="shrink-0 text-muted-foreground hover:text-destructive"
                aria-label={t('courses.editor.removeItem', { index: index + 1 })}
                onClick={() => onChange(items.filter((current) => current.key !== item.key))}
              >
                <X aria-hidden="true" />
              </Button>
            </li>
          ))}
        </ol>
      )}
      <Button type="button" variant="outline" size="sm" onClick={add} disabled={items.length >= MAX_LIST_ITEMS}>
        <Plus aria-hidden="true" />
        {addLabel}
      </Button>
    </div>
  )
}
