'use client'

import { useLanguage, LANGUAGE_LABELS, type Language } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Check, Globe } from 'lucide-react'

const LANGS: Language[] = ['uz', 'ru', 'en']

export function LanguageSwitcher({ variant = 'icon' }: { variant?: 'icon' | 'full' }) {
  const { lang, setLang } = useLanguage()

  if (variant === 'full') {
    return (
      <div className="flex items-center gap-1 p-1 rounded-lg bg-muted">
        {LANGS.map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              lang === l
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Language">
          <Globe className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LANGS.map((l) => (
          <DropdownMenuItem
            key={l}
            onClick={() => setLang(l)}
            className="flex items-center justify-between gap-2 cursor-pointer"
          >
            <span>{LANGUAGE_LABELS[l]}</span>
            {lang === l && <Check className="w-4 h-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
