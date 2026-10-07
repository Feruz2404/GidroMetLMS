'use client'

import { useState } from 'react'
import { Markdown } from '@/components/shared/markdown'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { useI18n } from '@/i18n/provider'
import { cn } from '@/lib/utils'

interface MarkdownEditorProps {
  id: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minHeightClass?: string
  invalid?: boolean
}

/** Markdown textarea with a rendered preview toggle. */
export function MarkdownEditor({ id, value, onChange, placeholder, minHeightClass = 'min-h-56', invalid }: MarkdownEditorProps) {
  const { t } = useI18n()
  const [mode, setMode] = useState<'write' | 'preview'>('write')

  return (
    <div
      className={cn(
        'overflow-hidden rounded-md border border-input shadow-xs transition-[color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 dark:bg-input/30',
        invalid && 'border-destructive'
      )}
    >
      <Tabs value={mode} onValueChange={(next) => setMode(next as 'write' | 'preview')} className="gap-0">
        <div className="flex items-center justify-between gap-2 border-b bg-muted/40 px-2 py-1.5">
          <TabsList className="h-8">
            <TabsTrigger value="write" className="px-3 text-xs">
              {t('courses.editor.markdown.write')}
            </TabsTrigger>
            <TabsTrigger value="preview" className="px-3 text-xs">
              {t('courses.editor.markdown.preview')}
            </TabsTrigger>
          </TabsList>
          <span className="hidden text-xs text-muted-foreground sm:inline">{t('courses.editor.markdown.hint')}</span>
        </div>
      </Tabs>
      {mode === 'write' ? (
        <Textarea
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          aria-invalid={invalid || undefined}
          className={cn('max-h-[32rem] rounded-none border-0 bg-transparent font-mono text-[0.85rem] leading-relaxed shadow-none focus-visible:ring-0 dark:bg-transparent', minHeightClass)}
        />
      ) : (
        <div className={cn('max-h-[28rem] overflow-y-auto bg-card px-4 py-3 scrollbar-thin', minHeightClass)}>
          {value.trim() ? <Markdown className="text-[0.95rem]">{value}</Markdown> : <p className="text-sm text-muted-foreground">{t('courses.editor.markdown.empty')}</p>}
        </div>
      )}
    </div>
  )
}
