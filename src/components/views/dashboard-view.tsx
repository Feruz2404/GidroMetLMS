'use client'

import { useEffect, useState, useCallback } from 'react'
import { api } from '@/lib/api'
import { useNav } from '@/store/auth'
import { useTranslation, type Language } from '@/lib/i18n'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import {
  Users,
  GraduationCap,
  BookOpen,
  Award,
  TrendingUp,
  Library,
  FileQuestion,
  Activity,
  ArrowRight,
  CheckCircle2,
  BarChart3,
} from 'lucide-react'
import { timeAgo } from '@/lib/api'

interface DashboardData {
  role: string
  stats: Record<string, number>
  enrollments?: Array<{
    id: string
    progress: number
    status: string
    course: {
      id: string
      title: string
      thumbnailUrl?: string | null
      durationHours: number
      level: string
      tutor: { firstName: string; lastName: string }
      category: { name: string; icon?: string | null }
      _count: { lessons: number }
    }
  }>
  certificates?: Array<{
    id: string
    certNumber: string
    percentage: number
    issuedAt: string
    course: { id: string; title: string }
  }>
  recentAttempts?: Array<{
    id: string
    score: number
    maxScore: number
    percentage: number
    passed: boolean
    submittedAt: string | null
    quiz: { id: string; title: string }
  }>
  weeklyActivity?: Array<{ date: string; count: number }>
  dailyActive?: Array<{ date: string; count: number }>
  topCourses?: Array<{
    id: string
    title: string
    _count: { enrollments: number; lessons: number }
  }>
  recentCertificates?: Array<{
    id: string
    certNumber: string
    percentage: number
    issuedAt: string
    user: { firstName: string; lastName: string }
    course: { title: string }
  }>
  courses?: Array<{
    id: string
    title: string
    _count: { enrollments: number; lessons: number }
    category: { name: string } | null
  }>
}

const PIE_COLORS = ['#0f766e', '#14b8a6', '#84cc16', '#eab308', '#f97316']

const LOCALE_MAP: Record<Language, string> = {
  uz: 'uz-UZ',
  ru: 'ru-RU',
  en: 'en-US',
}

export function DashboardView() {
  const { t } = useTranslation()
  const navigate = useNav((s) => s.navigate)
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const load = useCallback(() => {
    // Deferred to a microtask so the initial call from the mount effect does not
    // set state synchronously within the effect body.
    Promise.resolve().then(() => {
      setLoading(true)
      setError(false)
    })
    api
      .get<{ data: DashboardData }>('/dashboard')
      .then((r) => setData(r.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="h-32" />
          </Card>
        ))}
      </div>
    )
  }

  if (error || !data) {
    return (
      <Card className="p-8">
        <div className="flex flex-col items-center text-center gap-3">
          <p className="text-sm text-muted-foreground">{t('common.error')}</p>
          <Button variant="outline" onClick={load}>{t('common.retry')}</Button>
        </div>
      </Card>
    )
  }

  if (data.role === 'student') return <StudentDashboard data={data} onNavigate={navigate} />
  if (data.role === 'tutor') return <TutorDashboard data={data} onNavigate={navigate} />
  return <AdminDashboard data={data} onNavigate={navigate} />
}

function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  color = 'primary',
}: {
  icon: typeof Users
  label: string
  value: string | number
  trend?: string
  color?: 'primary' | 'success' | 'warning' | 'info'
}) {
  const colorMap = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    info: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  }
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {trend && (
              <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> {trend}
              </p>
            )}
          </div>
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${colorMap[color]}`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function StudentDashboard({ data, onNavigate }: { data: DashboardData; onNavigate: (v: string, p?: Record<string, string>) => void }) {
  const { t, lang } = useTranslation()
  const activity = data.weeklyActivity ?? []
  const lessonsLabel = t('dashboard.chart.lessons')
  const chartData = activity.map((a) => {
    const d = new Date(a.date)
    return { day: d.toLocaleDateString(LOCALE_MAP[lang], { weekday: 'short' }), [lessonsLabel]: a.count }
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t('auth.welcomeBack')}</h1>
        <p className="text-muted-foreground">{t('dashboard.subtitle.student')}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={BookOpen} label={t('dashboard.activeCourses')} value={data.stats.inProgress ?? 0} color="primary" />
        <StatCard icon={CheckCircle2} label={t('dashboard.completedCourses')} value={data.stats.completed ?? 0} color="success" />
        <StatCard icon={Award} label={t('dashboard.myCertificates')} value={data.stats.certificates ?? 0} color="warning" />
        <StatCard icon={Activity} label={t('dashboard.avgProgress')} value={`${data.stats.avgProgress ?? 0}%`} color="info" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active courses */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{t('dashboard.currentCourses')}</CardTitle>
              <CardDescription>{t('dashboard.currentCoursesDesc')}</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('courses')}>
              {t('common.viewAll')} <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {(data.enrollments ?? []).map((e) => (
              <button
                key={e.id}
                onClick={() => onNavigate('course-detail', { id: e.course.id })}
                className="w-full flex items-center gap-4 p-3 rounded-lg border border-border hover:bg-accent transition-colors text-left"
              >
                {e.course.thumbnailUrl ? (
                  <img src={e.course.thumbnailUrl} alt="" className="w-14 h-14 rounded-lg object-cover" />
                ) : (
                  <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{e.course.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {e.course._count.lessons} {t('common.lessons')} • {e.course.durationHours} {t('common.hours')}
                  </div>
                  <Progress value={e.progress} className="h-1.5 mt-1.5" />
                </div>
                <div className="text-sm font-semibold text-primary">{e.progress}%</div>
              </button>
            ))}
            {(data.enrollments ?? []).length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                {t('courses.noCourses')}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Weekly activity */}
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.weeklyActivity')}</CardTitle>
            <CardDescription>{t('dashboard.last7days')}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorAct" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f766e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0f766e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid var(--border)' }} />
                <Area type="monotone" dataKey={lessonsLabel} stroke="#0f766e" fill="url(#colorAct)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Certificates */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{t('dashboard.myCertificates')}</CardTitle>
              <CardDescription>{t('dashboard.myCertificatesDesc')}</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('certificates')}>
              {t('common.viewAll')} <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {(data.certificates ?? []).map((c) => (
              <button
                key={c.id}
                onClick={() => onNavigate('certificates', { id: c.id })}
                className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <Award className="w-5 h-5 text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate text-sm">{c.course.title}</div>
                  <div className="text-xs text-muted-foreground">{c.certNumber}</div>
                </div>
                <Badge variant="secondary">{c.percentage}%</Badge>
              </button>
            ))}
            {(data.certificates ?? []).length === 0 && (
              <div className="text-center py-6 text-muted-foreground text-sm">{t('empty.noCertificates')}</div>
            )}
          </CardContent>
        </Card>

        {/* Recent attempts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{t('dashboard.recentTests')}</CardTitle>
              <CardDescription>{t('dashboard.recentTestsDesc')}</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('quizzes')}>
              {t('common.viewAll')} <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {(data.recentAttempts ?? []).map((a) => (
              <div key={a.id} className="flex items-center gap-3 p-3 rounded-lg border border-border">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${a.passed ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                  <FileQuestion className={`w-5 h-5 ${a.passed ? 'text-emerald-600' : 'text-red-600'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate text-sm">{a.quiz.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {a.score}/{a.maxScore} {t('quizzes.points')} • {a.submittedAt ? timeAgo(a.submittedAt) : ''}
                  </div>
                </div>
                <Badge variant={a.passed ? 'default' : 'destructive'}>{a.percentage}%</Badge>
              </div>
            ))}
            {(data.recentAttempts ?? []).length === 0 && (
              <div className="text-center py-6 text-muted-foreground text-sm">{t('dashboard.noTestsTaken')}</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function TutorDashboard({ data, onNavigate }: { data: DashboardData; onNavigate: (v: string, p?: Record<string, string>) => void }) {
  const { t } = useTranslation()
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t('dashboard.tutor')}</h1>
        <p className="text-muted-foreground">{t('dashboard.subtitle.tutor')}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={BookOpen} label={t('dashboard.myCourses')} value={data.stats.courses ?? 0} color="primary" />
        <StatCard icon={Users} label={t('dashboard.totalStudents')} value={data.stats.students ?? 0} color="info" />
        <StatCard icon={FileQuestion} label={t('dashboard.testAttempts')} value={data.stats.attempts ?? 0} color="warning" />
        <StatCard icon={CheckCircle2} label={t('dashboard.passRate')} value={`${data.stats.passed ?? 0}`} color="success" />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{t('dashboard.myCourses')}</CardTitle>
            <CardDescription>{t('dashboard.myCoursesDesc')}</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={() => onNavigate('courses')}>
            {t('common.viewAll')} <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {(data.courses ?? []).map((c) => (
            <button
              key={c.id}
              onClick={() => onNavigate('course-detail', { id: c.id })}
              className="w-full flex items-center gap-4 p-3 rounded-lg border border-border hover:bg-accent text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{c.title}</div>
                <div className="text-xs text-muted-foreground">
                  {c._count.lessons} {t('common.lessons')} • {c.category?.name ?? t('courses.noCategory')}
                </div>
              </div>
              <Badge variant="secondary">{c._count.enrollments} {t('common.students')}</Badge>
            </button>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

function AdminDashboard({ data, onNavigate }: { data: DashboardData; onNavigate: (v: string, p?: Record<string, string>) => void }) {
  const { t, lang } = useTranslation()
  const usersLabel = t('dashboard.chart.users')
  const dailyData = (data.dailyActive ?? []).map((d) => {
    const date = new Date(d.date)
    return { date: date.toLocaleDateString(LOCALE_MAP[lang], { day: '2-digit', month: '2-digit' }), [usersLabel]: d.count }
  })

  const pieData = [
    { name: t('dashboard.chart.students'), value: data.stats.totalStudents ?? 0 },
    { name: t('dashboard.chart.tutors'), value: data.stats.totalTutors ?? 0 },
    { name: t('dashboard.chart.admins'), value: (data.stats.totalStudents ?? 0) + (data.stats.totalTutors ?? 0) > 0 ? Math.max(1, ((data.stats.totalUsers ?? data.stats.totalStudents + data.stats.totalTutors) - (data.stats.totalStudents ?? 0) - (data.stats.totalTutors ?? 0))) : 1 },
  ]

  const studentsLabel = t('dashboard.chart.students')

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{t('dashboard.admin')}</h1>
          <p className="text-muted-foreground">{t('dashboard.subtitle.admin')}</p>
        </div>
        <Button onClick={() => onNavigate('reports')} variant="outline">
          <BarChart3 className="w-4 h-4 mr-2" /> {t('dashboard.detailedReport')}
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={GraduationCap} label={t('dashboard.totalStudents')} value={data.stats.totalStudents ?? 0} color="primary" />
        <StatCard icon={Users} label={t('dashboard.totalTutors')} value={data.stats.totalTutors ?? 0} color="info" />
        <StatCard icon={BookOpen} label={t('dashboard.totalCourses')} value={data.stats.totalCourses ?? 0} color="warning" />
        <StatCard icon={Award} label={t('dashboard.totalCertificates')} value={data.stats.totalCertificates ?? 0} color="success" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Library} label={t('dashboard.totalResources')} value={data.stats.totalResources ?? 0} color="info" />
        <StatCard icon={Activity} label={t('dashboard.activeUsers30')} value={data.stats.activeUsers ?? 0} color="primary" />
        <StatCard icon={CheckCircle2} label={t('dashboard.passRate')} value={`${data.stats.passRate ?? 0}%`} color="success" />
        <StatCard icon={TrendingUp} label={t('dashboard.avgScore')} value={`${data.stats.avgScore ?? 0}%`} color="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t('dashboard.usersDynamics')}</CardTitle>
            <CardDescription>{t('dashboard.usersDynamicsDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={dailyData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f766e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0f766e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid var(--border)' }} />
                <Area type="monotone" dataKey={usersLabel} stroke="#0f766e" fill="url(#colorUsers)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.usersComposition')}</CardTitle>
            <CardDescription>{t('dashboard.usersCompositionDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.topCourses')}</CardTitle>
            <CardDescription>{t('dashboard.topCoursesDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={(data.topCourses ?? []).map((c) => ({ name: c.title.slice(0, 20) + '...', [studentsLabel]: c._count.enrollments }))} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid var(--border)' }} />
                <Bar dataKey={studentsLabel} fill="#0f766e" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{t('dashboard.recentCertificates')}</CardTitle>
              <CardDescription>{t('dashboard.recentCertificatesDesc')}</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('certificates')}>
              {t('common.viewAll')} <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {(data.recentCertificates ?? []).map((c) => (
              <div key={c.id} className="flex items-center gap-3 p-3 rounded-lg border border-border">
                <Avatar className="w-9 h-9">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    {(c.user.firstName?.[0] ?? '?')}{(c.user.lastName?.[0] ?? '?')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate text-sm">{c.user.firstName} {c.user.lastName}</div>
                  <div className="text-xs text-muted-foreground truncate">{c.course.title}</div>
                </div>
                <div className="text-right">
                  <Badge variant="secondary">{c.percentage}%</Badge>
                  <div className="text-xs text-muted-foreground mt-1">{timeAgo(c.issuedAt)}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
