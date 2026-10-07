'use client'

import { useCallback } from 'react'
import { useI18n } from '@/i18n/provider'
import type { ResourceType } from '@/shared/dto'

export const RESOURCE_TYPES: readonly ResourceType[] = ['book', 'manual', 'article', 'document', 'normative', 'presentation', 'video', 'audio']
export const RESOURCE_LANGUAGES = ['uz', 'ru', 'en'] as const
export type ResourceLanguage = (typeof RESOURCE_LANGUAGES)[number]

const isType = (value: string): value is ResourceType => RESOURCE_TYPES.includes(value as ResourceType)
export const isLanguage = (value: string): value is ResourceLanguage => RESOURCE_LANGUAGES.includes(value as ResourceLanguage)

/** Localized labels for resource types and languages; unknown legacy values are shown as stored. */
export function useLibraryLabels() {
  const { t } = useI18n()
  const type = useCallback((value: string) => (isType(value) ? t(`library.type.${value}`) : value), [t])
  const language = useCallback((value: string) => (isLanguage(value) ? t(`library.lang.${value}`) : value.toUpperCase()), [t])
  return { type, language }
}

export function byline(resource: { author: string | null; publisher: string | null }): string {
  return [resource.author, resource.publisher].filter(Boolean).join(' · ')
}
