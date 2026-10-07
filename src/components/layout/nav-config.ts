import {
  Award,
  BarChart3,
  BookOpen,
  ClipboardCheck,
  LayoutDashboard,
  Library,
  Users,
  type LucideIcon,
} from 'lucide-react'
import type { MessageKey } from '@/i18n'
import { routes } from '@/lib/routes'
import { hasPermission, isManagerRole, PERMISSIONS, canViewReports } from '@/shared/roles'

export interface NavItem {
  href: string
  label: MessageKey
  icon: LucideIcon
  visible: (role: string) => boolean
}

export interface NavGroup {
  label: MessageKey
  items: NavItem[]
}

const everyone = () => true

export const NAV_GROUPS: NavGroup[] = [
  {
    label: 'nav.group.learning',
    items: [
      { href: routes.dashboard, label: 'nav.dashboard', icon: LayoutDashboard, visible: everyone },
      { href: routes.courses, label: 'nav.courses', icon: BookOpen, visible: everyone },
      { href: routes.quizzes, label: 'nav.quizzes', icon: ClipboardCheck, visible: (role) => !isManagerRole(role) },
      { href: routes.library, label: 'nav.library', icon: Library, visible: everyone },
      { href: routes.certificates, label: 'nav.certificates', icon: Award, visible: everyone },
    ],
  },
  {
    label: 'nav.group.management',
    items: [
      { href: routes.reports, label: 'nav.reports', icon: BarChart3, visible: canViewReports },
      { href: routes.users, label: 'nav.users', icon: Users, visible: (role) => hasPermission(role, PERMISSIONS.USERS_MANAGE) },
    ],
  },
]

/** A nav item is active for its own path and every nested path (e.g. /courses/123). */
export function isActivePath(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`) || (href === routes.quizzes && pathname.startsWith('/attempts/'))
}
