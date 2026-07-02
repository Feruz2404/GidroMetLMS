'use client'

import { useEffect } from 'react'
import { useAuth, useNav } from '@/store/auth'
import { useInitLanguage, useTranslation } from '@/lib/i18n'
import { LoginView } from '@/components/views/login-view'
import { RegisterView } from '@/components/views/register-view'
import { AppShell } from '@/components/app/app-shell'
import { DashboardView } from '@/components/views/dashboard-view'
import { CoursesView } from '@/components/views/courses-view'
import { CourseDetailView } from '@/components/views/course-detail-view'
import { QuizzesView } from '@/components/views/quizzes-view'
import { QuizTakingView } from '@/components/views/quiz-taking-view'
import { LibraryView } from '@/components/views/library-view'
import { LibraryDetailView } from '@/components/views/library-detail-view'
import { CertificatesView } from '@/components/views/certificates-view'
import { CertificateVerifyView } from '@/components/views/certificate-verify-view'
import { ReportsView } from '@/components/views/reports-view'
import { UsersView } from '@/components/views/users-view'
import { SettingsView } from '@/components/views/settings-view'
import { NotificationsView } from '@/components/views/notifications-view'
import { Loader2 } from 'lucide-react'

export default function Home() {
  const user = useAuth((s) => s.user)
  const initialized = useAuth((s) => s.initialized)
  const fetchUser = useAuth((s) => s.fetchUser)
  const view = useNav((s) => s.view)
  const navigate = useNav((s) => s.navigate)
  const { t } = useTranslation()

  // Initialize language from localStorage on mount
  useInitLanguage()

  useEffect(() => {
    if (!useAuth.getState().initialized) {
      fetchUser()
    }
  }, [fetchUser])

  // Role-based view guard
  useEffect(() => {
    if (!user) return
    const adminOnly = ['users']
    const staffOnly = ['reports']
    if (adminOnly.includes(view) && user.role !== 'admin') {
      navigate('dashboard')
    } else if (staffOnly.includes(view) && user.role === 'student') {
      navigate('dashboard')
    }
  }, [user, view, navigate])

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  // Public certificate verification view
  if (view === 'certificate-verify' && !user) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          <CertificateVerifyView />
        </div>
      </div>
    )
  }

  if (!user) {
    if (view === 'register') return <RegisterView />
    return <LoginView />
  }

  return (
    <AppShell>
      {view === 'dashboard' && <DashboardView />}
      {view === 'courses' && <CoursesView />}
      {view === 'course-detail' && <CourseDetailView />}
      {view === 'quizzes' && <QuizzesView />}
      {view === 'quiz-taking' && <QuizTakingView />}
      {view === 'library' && <LibraryView />}
      {view === 'library-detail' && <LibraryDetailView />}
      {view === 'certificates' && <CertificatesView />}
      {view === 'certificate-verify' && <CertificateVerifyView />}
      {view === 'reports' && <ReportsView />}
      {view === 'users' && <UsersView />}
      {view === 'settings' && <SettingsView />}
      {view === 'notifications' && <NotificationsView />}
    </AppShell>
  )
}
