'use client'

import Link from 'next/link'
import { BarChart3, BookOpen, Building2, ClipboardPlus, Plus, UserPlus } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useSession } from '@/features/auth/session'
import type { MessageKey } from '@/i18n'
import { useI18n } from '@/i18n/provider'
import { routes } from '@/lib/routes'
import { cn } from '@/lib/utils'
import { PERMISSIONS } from '@/shared/roles'
import { useNow } from '../use-now'

function greetingKey(hour: number): MessageKey {
  if (hour >= 5 && hour < 12) return 'dashboard.greeting.morning'
  if (hour >= 12 && hour < 18) return 'dashboard.greeting.afternoon'
  return 'dashboard.greeting.evening'
}

function localDateKey(date: Date): string {
  return [date.getFullYear(), date.getMonth() + 1, date.getDate()].map((part) => String(part).padStart(2, '0')).join('-')
}

/** Personal greeting by the viewer's local time, today's date, a role subtitle and quick actions. */
export function DashboardHeader({ department }: { department: string | null }) {
  const { t, formatDate } = useI18n()
  const session = useSession()
  const now = useNow()
  const date = now === null ? null : new Date(now)
  const today = date ? formatDate(date, 'long') : null
  const scope = session.isManager ? (department ?? session.user.department) : null

  const subtitle = session.isLearner
    ? t('dashboard.subtitle.learner')
    : session.isInstructor
      ? t('dashboard.subtitle.instructor')
      : session.isManager
        ? t('dashboard.subtitle.department')
        : t('dashboard.subtitle.organization')

  return (
    <PageHeader
      eyebrow={
        <time dateTime={date ? localDateKey(date) : undefined} className={cn('block', !today && 'invisible')}>
          {today ?? '-'}
        </time>
      }
      title={<span className={cn(!date && 'invisible')}>{t(date ? greetingKey(date.getHours()) : 'dashboard.greeting.afternoon', { name: session.user.firstName })}</span>}
      description={
        <>
          {subtitle}
          {scope && (
            <Badge variant="brand" className="ml-2 align-middle">
              <Building2 aria-hidden="true" />
              <span className="sr-only">{t('dashboard.scope')}: </span>
              {scope}
            </Badge>
          )}
        </>
      }
      actions={<QuickActions />}
    />
  )
}

function QuickActions() {
  const { t } = useI18n()
  const session = useSession()

  if (session.isLearner) {
    return (
      <Button asChild variant="outline">
        <Link href={routes.courses}>
          <BookOpen aria-hidden="true" />
          {t('dashboard.action.catalog')}
        </Link>
      </Button>
    )
  }

  if (session.isInstructor) {
    return (
      <>
        <Button asChild variant="outline">
          <Link href={routes.newQuiz()}>
            <ClipboardPlus aria-hidden="true" />
            {t('dashboard.action.newQuiz')}
          </Link>
        </Button>
        <Button asChild>
          <Link href={routes.newCourse}>
            <Plus aria-hidden="true" />
            {t('dashboard.action.newCourse')}
          </Link>
        </Button>
      </>
    )
  }

  return (
    <>
      {session.canViewReports && (
        <Button asChild variant="outline">
          <Link href={routes.reports}>
            <BarChart3 aria-hidden="true" />
            {t('nav.reports')}
          </Link>
        </Button>
      )}
      {session.canManageContent && (
        <Button asChild variant="outline">
          <Link href={routes.newCourse}>
            <Plus aria-hidden="true" />
            {t('dashboard.action.newCourse')}
          </Link>
        </Button>
      )}
      {session.can(PERMISSIONS.USERS_MANAGE) && (
        <Button asChild>
          <Link href={`${routes.users}?new=1`}>
            <UserPlus aria-hidden="true" />
            {t('dashboard.action.addUser')}
          </Link>
        </Button>
      )}
    </>
  )
}
