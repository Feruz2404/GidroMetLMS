'use client'

import { Badge } from '@/components/ui/badge'
import type { MessageKey } from '@/i18n'
import { useI18n } from '@/i18n/provider'
import { canonicalRole, ROLES, type Role } from '@/shared/roles'

const VARIANTS: Partial<Record<Role, React.ComponentProps<typeof Badge>['variant']>> = {
  [ROLES.SUPER_ADMIN]: 'default',
  [ROLES.ADMINISTRATOR]: 'brand',
  [ROLES.INSTRUCTOR]: 'info',
  [ROLES.DEPARTMENT_MANAGER]: 'warning',
  [ROLES.LEARNER]: 'muted',
}

export function RoleBadge({ role, className }: { role: string; className?: string }) {
  const { t } = useI18n()
  const canonical = canonicalRole(role)
  return (
    <Badge variant={VARIANTS[canonical] ?? 'muted'} className={className}>
      {t(`role.${canonical}` as MessageKey)}
    </Badge>
  )
}
