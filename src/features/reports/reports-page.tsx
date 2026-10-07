'use client'

import { Award, BookOpen, ClipboardCheck, LayoutDashboard, Library, ScrollText, Users, type LucideIcon } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useSession } from '@/features/auth/session'
import { useUrlState } from '@/hooks/use-url-state'
import type { MessageKey } from '@/i18n'
import { useI18n } from '@/i18n/provider'
import type { ReportType } from '@/shared/dto'
import { PERMISSIONS } from '@/shared/roles'
import { AssessmentsReport } from './components/assessments-report'
import { AuditReport } from './components/audit-report'
import { CertificatesReport } from './components/certificates-report'
import { CoursesReport } from './components/courses-report'
import { LearnersReport } from './components/learners-report'
import { LibraryReport } from './components/library-report'
import { OverviewReport } from './components/overview-report'

type Session = ReturnType<typeof useSession>

interface ReportTab {
  value: ReportType
  label: MessageKey
  icon: LucideIcon
  content: React.ComponentType
  visible?: (session: Session) => boolean
}

const TABS: ReportTab[] = [
  { value: 'overview', label: 'reports.tab.overview', icon: LayoutDashboard, content: OverviewReport },
  { value: 'learners', label: 'reports.tab.learners', icon: Users, content: LearnersReport },
  { value: 'courses', label: 'reports.tab.courses', icon: BookOpen, content: CoursesReport },
  { value: 'assessments', label: 'reports.tab.assessments', icon: ClipboardCheck, content: AssessmentsReport },
  { value: 'certificates', label: 'reports.tab.certificates', icon: Award, content: CertificatesReport },
  // Library usage is organisation-wide, so it is not part of a department manager's scope.
  { value: 'library', label: 'reports.tab.library', icon: Library, content: LibraryReport, visible: (session) => !session.isManager },
  { value: 'audit', label: 'reports.tab.audit', icon: ScrollText, content: AuditReport, visible: (session) => session.can(PERMISSIONS.AUDIT_VIEW) },
]

export function ReportsPage() {
  const { t } = useI18n()
  const session = useSession()
  const [state, setState] = useUrlState({ tab: 'overview' })
  const tabs = TABS.filter((tab) => !tab.visible || tab.visible(session))
  const active = tabs.some((tab) => tab.value === state.tab) ? state.tab : 'overview'

  const scope = session.can(PERMISSIONS.REPORTS_VIEW_ALL)
    ? t('reports.scope.organization')
    : session.isManager
      ? t('reports.scope.department', { name: session.user.department ?? t('common.none') })
      : t('reports.scope.ownCourses')

  return (
    <div>
      <PageHeader title={t('reports.title')} description={scope} />
      <Tabs value={active} onValueChange={(tab) => setState({ tab })} className="gap-6">
        <div className="-mx-4 overflow-x-auto px-4 scrollbar-thin sm:mx-0 sm:px-0">
          <TabsList className="h-10 w-max">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="px-3">
                <tab.icon aria-hidden="true" />
                {t(tab.label)}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <tab.content />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
