'use client'

import { Badge } from '@/components/ui/badge'
import type { MessageKey } from '@/i18n'
import { useI18n } from '@/i18n/provider'

type Variant = 'success' | 'warning' | 'info' | 'muted' | 'destructive' | 'brand'

const STATUS: Record<string, { key: MessageKey; variant: Variant }> = {
  draft: { key: 'status.draft', variant: 'warning' },
  published: { key: 'status.published', variant: 'success' },
  archived: { key: 'status.archived', variant: 'muted' },
  active: { key: 'status.active', variant: 'success' },
  inactive: { key: 'status.inactive', variant: 'muted' },
  completed: { key: 'status.completed', variant: 'success' },
  in_progress: { key: 'status.inProgress', variant: 'info' },
  not_started: { key: 'status.notStarted', variant: 'muted' },
  dropped: { key: 'status.dropped', variant: 'muted' },
  revoked: { key: 'status.revoked', variant: 'destructive' },
  expired: { key: 'status.expired', variant: 'warning' },
  passed: { key: 'status.passed', variant: 'success' },
  failed: { key: 'status.failed', variant: 'destructive' },
}

/** Consistent label + colour for every lifecycle status in the app. */
export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const { t } = useI18n()
  const config = STATUS[status] ?? { key: 'common.none' as MessageKey, variant: 'muted' as Variant }
  return (
    <Badge variant={config.variant} className={className}>
      {t(config.key)}
    </Badge>
  )
}

export function LevelBadge({ level }: { level: string }) {
  const { t } = useI18n()
  const variant: Variant = level === 'advanced' ? 'destructive' : level === 'intermediate' ? 'info' : 'success'
  return (
    <Badge variant={variant === 'destructive' ? 'brand' : variant}>{t(`level.${level}` as MessageKey)}</Badge>
  )
}
