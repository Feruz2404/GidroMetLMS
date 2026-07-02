'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { useAuth } from '@/store/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import {
  Users,
  BookOpen,
  Award,
  Download,
  FileQuestion,
  Library,
  Activity,
  BarChart3,
} from 'lucide-react'
import { formatDate, formatDateTime, timeAgo } from '@/lib/api'
import { useTranslation } from '@/lib/i18n'

const PIE_COLORS = ['#0f766e', '#14b8a6', '#84cc16', '#eab308', '#f97316']

type ReportType = 'overview' | 'students' | 'courses' | 'quiz-results' | 'certificates' | 'library-usage' | 'audit-log'

export function ReportsView() {
  const { t } = useTranslation()
  const isAdmin = useAuth((s) => s.user?.role === 'admin')
  const [tab, setTab] = useState<ReportType>('overview')
  const [data, setData] = useState<Record<string, unknown>>({})
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    Promise.resolve().then(() => setLoading(true))
    api
      .get<{ data: Record<string, unknown> }>(`/reports?type=${tab}`)
      .then((r) => setData(r.data))
      .catch(() => setData({}))
      .finally(() => setLoading(false))
  }, [tab])

  const exportCsv = () => {
    const rows = extractRows(data, tab)
    if (!rows.length) return
    const headers = Object.keys(rows[0])
    const csv = [
      headers.join(','),
      ...rows.map((r) => headers.map((h) => `"${String((r as Record<string, unknown>)[h] ?? '').replace(/"/g, '""')}"`).join(',')),
    ].join('\n')
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${tab}-report.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{t('reports.title')}</h1>
          <p className="text-muted-foreground">{t('reports.subtitle')}</p>
        </div>
        <Button onClick={exportCsv} variant="outline">
          <Download className="w-4 h-4 mr-2" /> {t('common.exportCsv')}
        </Button>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as ReportType)}>
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="overview"><BarChart3 className="w-4 h-4 mr-1" /> {t('reports.tab.overview')}</TabsTrigger>
          <TabsTrigger value="students"><Users className="w-4 h-4 mr-1" /> {t('reports.tab.students')}</TabsTrigger>
          <TabsTrigger value="courses"><BookOpen className="w-4 h-4 mr-1" /> {t('reports.tab.courses')}</TabsTrigger>
          <TabsTrigger value="quiz-results"><FileQuestion className="w-4 h-4 mr-1" /> {t('reports.tab.quizResults')}</TabsTrigger>
          <TabsTrigger value="certificates"><Award className="w-4 h-4 mr-1" /> {t('reports.tab.certificates')}</TabsTrigger>
          <TabsTrigger value="library-usage"><Library className="w-4 h-4 mr-1" /> {t('reports.tab.library')}</TabsTrigger>
          {/* Audit log (user actions + IP addresses) is admin-only, matching the API. */}
          {isAdmin && (
            <TabsTrigger value="audit-log"><Activity className="w-4 h-4 mr-1" /> {t('reports.tab.auditLog')}</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          {loading ? <Loading /> : <OverviewReport data={data} />}
        </TabsContent>
        <TabsContent value="students" className="mt-4">
          {loading ? <Loading /> : (
            <>
              <Input placeholder={t('reports.searchByName')} value={search} onChange={(e) => setSearch(e.target.value)} className="mb-4 max-w-sm" />
              <StudentsReport data={data} search={search} />
            </>
          )}
        </TabsContent>
        <TabsContent value="courses" className="mt-4">
          {loading ? <Loading /> : <CoursesReport data={data} />}
        </TabsContent>
        <TabsContent value="quiz-results" className="mt-4">
          {loading ? <Loading /> : <QuizResultsReport data={data} />}
        </TabsContent>
        <TabsContent value="certificates" className="mt-4">
          {loading ? <Loading /> : <CertificatesReport data={data} />}
        </TabsContent>
        <TabsContent value="library-usage" className="mt-4">
          {loading ? <Loading /> : <LibraryUsageReport data={data} />}
        </TabsContent>
        {isAdmin && (
          <TabsContent value="audit-log" className="mt-4">
            {loading ? <Loading /> : <AuditLogReport data={data} />}
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}

function Loading() {
  const { t } = useTranslation()
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">{t('common.loading')}</p>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-16 rounded-lg bg-muted animate-pulse" />
      ))}
    </div>
  )
}

function extractRows(data: Record<string, unknown>, tab: string): Record<string, unknown>[] {
  const keys: Record<string, string> = {
    students: 'students',
    courses: 'courses',
    'quiz-results': 'attempts',
    certificates: 'certificates',
    'library-usage': 'resources',
    'audit-log': 'logs',
  }
  const k = keys[tab]
  if (!k) return []
  const v = data[k]
  return Array.isArray(v) ? (v as Record<string, unknown>[]) : []
}

function StatBox({ icon: Icon, label, value, sub }: { icon: typeof Users; label: string; value: string | number; sub?: string }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
          </div>
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="w-5 h-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function OverviewReport({ data }: { data: Record<string, unknown> }) {
  const { t } = useTranslation()
  const o = (data.overview ?? {}) as Record<string, number>
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatBox icon={Users} label={t('dashboard.totalStudents')} value={o.totalStudents ?? 0} />
        <StatBox icon={Users} label={t('dashboard.totalTutors')} value={o.totalTutors ?? 0} />
        <StatBox icon={BookOpen} label={t('dashboard.totalCourses')} value={o.totalCourses ?? 0} />
        <StatBox icon={Award} label={t('dashboard.totalCertificates')} value={o.totalCertificates ?? 0} />
        <StatBox icon={FileQuestion} label={t('reports.testAttemptsLabel')} value={o.totalAttempts ?? 0} sub={t('reports.attemptsPassed').replace('{n}', String(o.passedAttempts ?? 0))} />
        <StatBox icon={Activity} label={t('reports.passRate')} value={`${o.passRate ?? 0}%`} />
        <StatBox icon={BookOpen} label={t('dashboard.totalEnrollments')} value={o.totalEnrollments ?? 0} sub={t('reports.enrollmentsCompleted').replace('{n}', String(o.completedEnrollments ?? 0))} />
        <StatBox icon={Library} label={t('nav.library')} value={o.totalResources ?? 0} sub={t('reports.resourcesDownloaded').replace('{n}', String(o.totalDownloads ?? 0))} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{t('reports.systemHealth')}</CardTitle>
          <CardDescription>{t('reports.generalIndicators')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-900">
              <div className="text-3xl font-bold text-emerald-700 dark:text-emerald-400">{o.completionRate ?? 0}%</div>
              <div className="text-sm text-muted-foreground">{t('reports.completionRate')}</div>
            </div>
            <div className="p-4 rounded-lg bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-900">
              <div className="text-3xl font-bold text-teal-700 dark:text-teal-400">{o.passRate ?? 0}%</div>
              <div className="text-sm text-muted-foreground">{t('reports.passRate')}</div>
            </div>
            <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900">
              <div className="text-3xl font-bold text-amber-700 dark:text-amber-400">{o.totalDownloads ?? 0}</div>
              <div className="text-sm text-muted-foreground">{t('reports.totalDownloads')}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function StudentsReport({ data, search }: { data: Record<string, unknown>; search: string }) {
  const { t } = useTranslation()
  const students = (data.students ?? []) as Array<Record<string, unknown>>
  const filtered = students.filter((s) =>
    search ? String(s.name).toLowerCase().includes(search.toLowerCase()) || String(s.email).toLowerCase().includes(search.toLowerCase()) : true
  )
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto scroll-area max-h-[600px]">
          <Table>
            <TableHeader className="sticky top-0 bg-card z-10">
              <TableRow>
                <TableHead>{t('reports.studentsHeader')}</TableHead>
                <TableHead>{t('users.department')}</TableHead>
                <TableHead className="text-center">{t('dashboard.totalCourses')}</TableHead>
                <TableHead className="text-center">{t('common.completed')}</TableHead>
                <TableHead className="text-center">{t('courses.progress')}</TableHead>
                <TableHead className="text-center">{t('reports.certShort')}</TableHead>
                <TableHead className="text-center">{t('nav.quizzes')}</TableHead>
                <TableHead className="text-center">{t('common.passed')}</TableHead>
                <TableHead>{t('users.lastLogin')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((s) => (
                <TableRow key={String(s.id)}>
                  <TableCell>
                    <div className="font-medium">{String(s.name)}</div>
                    <div className="text-xs text-muted-foreground">{String(s.email)}</div>
                  </TableCell>
                  <TableCell className="text-sm">{String(s.department)}</TableCell>
                  <TableCell className="text-center">{Number(s.enrolledCourses)}</TableCell>
                  <TableCell className="text-center">{Number(s.completedCourses)}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary">{Number(s.avgProgress)}%</Badge>
                  </TableCell>
                  <TableCell className="text-center">{Number(s.certificates)}</TableCell>
                  <TableCell className="text-center">{Number(s.attempts)}</TableCell>
                  <TableCell className="text-center">{Number(s.passedAttempts)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{s.lastLoginAt ? timeAgo(String(s.lastLoginAt)) : '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

function CoursesReport({ data }: { data: Record<string, unknown> }) {
  const { t } = useTranslation()
  const courses = (data.courses ?? []) as Array<Record<string, unknown>>
  const chartData = courses.map((c) => ({
    name: String(c.title).slice(0, 15) + '...',
    students: Number(c.enrolled),
    completed: Number(c.completed),
  }))
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('reports.coursesByStudents')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-15} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb' }} />
              <Legend />
              <Bar dataKey="students" name={t('reports.chart.students')} fill="#0f766e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="completed" name={t('reports.chart.completed')} fill="#84cc16" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto scroll-area max-h-[500px]">
            <Table>
              <TableHeader className="sticky top-0 bg-card z-10">
                <TableRow>
                  <TableHead>{t('reports.courseHeader')}</TableHead>
                  <TableHead>{t('reports.categoryHeader')}</TableHead>
                  <TableHead>{t('reports.tutorHeader')}</TableHead>
                  <TableHead className="text-center">{t('reports.lessonsHeader')}</TableHead>
                  <TableHead className="text-center">{t('dashboard.totalStudents')}</TableHead>
                  <TableHead className="text-center">{t('reports.completionPercent')}</TableHead>
                  <TableHead className="text-center">{t('reports.avgProgress')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((c) => (
                  <TableRow key={String(c.id)}>
                    <TableCell className="font-medium">{String(c.title)}</TableCell>
                    <TableCell className="text-sm">{String(c.category)}</TableCell>
                    <TableCell className="text-sm">{String(c.tutor)}</TableCell>
                    <TableCell className="text-center">{Number(c.lessons)}</TableCell>
                    <TableCell className="text-center">{Number(c.enrolled)}</TableCell>
                    <TableCell className="text-center"><Badge variant="secondary">{Number(c.completionRate)}%</Badge></TableCell>
                    <TableCell className="text-center">{Number(c.avgProgress)}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function QuizResultsReport({ data }: { data: Record<string, unknown> }) {
  const { t } = useTranslation()
  const attempts = (data.attempts ?? []) as Array<Record<string, unknown>>
  const dist = (data.distribution ?? []) as Array<{ range: string; count: number }>
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('reports.scoreDistribution')}</CardTitle>
            <CardDescription>{t('reports.quizResultsDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dist}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="range" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb' }} />
                <Bar dataKey="count" name={t('reports.chart.students')} fill="#0f766e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('reports.generalIndicators')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between"><span className="text-muted-foreground">{t('reports.totalAttemptsLabel')}</span><span className="font-semibold">{(data.total as number) ?? 0}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">{t('reports.totalPassed')}:</span><span className="font-semibold text-emerald-600">{attempts.filter((a) => a.passed).length}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">{t('reports.totalFailed')}:</span><span className="font-semibold text-red-600">{attempts.filter((a) => !a.passed).length}</span></div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto scroll-area max-h-[500px]">
            <Table>
              <TableHeader className="sticky top-0 bg-card z-10">
                <TableRow>
                  <TableHead>{t('reports.studentsHeader')}</TableHead>
                  <TableHead>{t('reports.quizHeader')}</TableHead>
                  <TableHead>{t('reports.courseHeader')}</TableHead>
                  <TableHead className="text-center">{t('reports.scoreShort')}</TableHead>
                  <TableHead className="text-center">{t('reports.percentShort')}</TableHead>
                  <TableHead className="text-center">{t('common.status')}</TableHead>
                  <TableHead>{t('common.date')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attempts.map((a) => (
                  <TableRow key={String(a.id)}>
                    <TableCell className="font-medium">{String(a.student)}</TableCell>
                    <TableCell className="text-sm">{String(a.quiz)}</TableCell>
                    <TableCell className="text-sm">{String(a.course)}</TableCell>
                    <TableCell className="text-center">{Number(a.score)}/{Number(a.maxScore)}</TableCell>
                    <TableCell className="text-center"><Badge variant="secondary">{Number(a.percentage)}%</Badge></TableCell>
                    <TableCell className="text-center">
                      <Badge variant={a.passed ? 'default' : 'destructive'}>{a.passed ? t('common.passed') : t('common.failed')}</Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{a.submittedAt ? formatDateTime(String(a.submittedAt)) : '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function CertificatesReport({ data }: { data: Record<string, unknown> }) {
  const { t } = useTranslation()
  const certs = (data.certificates ?? []) as Array<Record<string, unknown>>
  const monthly = (data.monthly ?? []) as Array<{ month: string; count: number }>
  const statusData = [
    { name: t('reports.statusActive'), value: certs.filter((c) => c.status === 'active').length },
    { name: t('reports.statusRevoked'), value: certs.filter((c) => c.status === 'revoked').length },
  ]
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('reports.monthlyDynamics')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthly.map((m) => ({ name: m.month, certificates: m.count }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb' }} />
                <Line type="monotone" dataKey="certificates" name={t('reports.chart.certificates')} stroke="#0f766e" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('reports.statusDistribution')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {statusData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto scroll-area max-h-[500px]">
            <Table>
              <TableHeader className="sticky top-0 bg-card z-10">
                <TableRow>
                  <TableHead>{t('reports.certNumberShort')}</TableHead>
                  <TableHead>{t('certificates.student')}</TableHead>
                  <TableHead>{t('certificates.course')}</TableHead>
                  <TableHead className="text-center">{t('certificates.score')}</TableHead>
                  <TableHead className="text-center">{t('common.status')}</TableHead>
                  <TableHead>{t('reports.issued')}</TableHead>
                  <TableHead>{t('reports.validUntilShort')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {certs.map((c) => (
                  <TableRow key={String(c.id)}>
                    <TableCell className="font-mono text-xs">{String(c.certNumber)}</TableCell>
                    <TableCell className="font-medium">{String(c.student)}</TableCell>
                    <TableCell className="text-sm">{String(c.course)}</TableCell>
                    <TableCell className="text-center"><Badge variant="secondary">{Number(c.percentage)}%</Badge></TableCell>
                    <TableCell className="text-center">
                      <Badge variant={c.status === 'active' ? 'default' : 'destructive'}>{c.status === 'active' ? t('reports.statusActive') : t('reports.revokedShort')}</Badge>
                    </TableCell>
                    <TableCell className="text-xs">{formatDate(String(c.issuedAt))}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{c.validUntil ? formatDate(String(c.validUntil)) : t('common.unlimited')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function LibraryUsageReport({ data }: { data: Record<string, unknown> }) {
  const { t } = useTranslation()
  const resources = (data.resources ?? []) as Array<Record<string, unknown>>
  const top10 = resources.slice(0, 10).map((r) => ({
    name: String(r.title).slice(0, 15) + '...',
    downloads: Number(r.downloads),
    views: Number(r.views),
  }))
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('reports.topResources')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={top10} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb' }} />
              <Legend />
              <Bar dataKey="downloads" name={t('reports.chart.downloads')} fill="#0f766e" radius={[0, 4, 4, 0]} />
              <Bar dataKey="views" name={t('reports.chart.views')} fill="#84cc16" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto scroll-area max-h-[500px]">
            <Table>
              <TableHeader className="sticky top-0 bg-card z-10">
                <TableRow>
                  <TableHead>{t('reports.resource')}</TableHead>
                  <TableHead>{t('common.type')}</TableHead>
                  <TableHead>{t('reports.categoryHeader')}</TableHead>
                  <TableHead>{t('library.author')}</TableHead>
                  <TableHead className="text-center">{t('library.downloads')}</TableHead>
                  <TableHead className="text-center">{t('library.views')}</TableHead>
                  <TableHead className="text-center">{t('reports.bookmarks')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resources.map((r) => (
                  <TableRow key={String(r.id)}>
                    <TableCell className="font-medium">{String(r.title)}</TableCell>
                    <TableCell><Badge variant="outline" className="capitalize">{String(r.type)}</Badge></TableCell>
                    <TableCell className="text-sm">{String(r.category)}</TableCell>
                    <TableCell className="text-sm">{String(r.author)}</TableCell>
                    <TableCell className="text-center">{Number(r.downloads)}</TableCell>
                    <TableCell className="text-center">{Number(r.views)}</TableCell>
                    <TableCell className="text-center">{Number(r.bookmarks)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function AuditLogReport({ data }: { data: Record<string, unknown> }) {
  const { t } = useTranslation()
  const logs = (data.logs ?? []) as Array<Record<string, unknown>>
  const actionColors: Record<string, string> = {
    login: 'bg-emerald-100 text-emerald-700',
    logout: 'bg-gray-100 text-gray-700',
    view_course: 'bg-blue-100 text-blue-700',
    take_quiz: 'bg-amber-100 text-amber-700',
    download_resource: 'bg-purple-100 text-purple-700',
    view_certificate: 'bg-teal-100 text-teal-700',
  }
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto scroll-area max-h-[600px]">
          <Table>
            <TableHeader className="sticky top-0 bg-card z-10">
              <TableRow>
                <TableHead>{t('reports.userHeader')}</TableHead>
                <TableHead>{t('reports.roleHeader')}</TableHead>
                <TableHead>{t('reports.action')}</TableHead>
                <TableHead>{t('reports.ipAddress')}</TableHead>
                <TableHead>{t('reports.time')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((l) => (
                <TableRow key={String(l.id)}>
                  <TableCell>
                    <div className="font-medium">{String(l.user)}</div>
                    <div className="text-xs text-muted-foreground">{String(l.email)}</div>
                  </TableCell>
                  <TableCell><Badge variant="outline" className="capitalize">{String(l.role)}</Badge></TableCell>
                  <TableCell>
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${actionColors[String(l.action)] ?? 'bg-gray-100 text-gray-700'}`}>
                      {String(l.action)}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs font-mono">{String(l.ipAddress)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatDateTime(String(l.createdAt))}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
