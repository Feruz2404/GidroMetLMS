'use client'

import { useState } from 'react'
import { useAuth, useNav } from '@/store/auth'
import { useTranslation } from '@/lib/i18n'
import { LanguageSwitcher } from '@/components/app/language-switcher'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Award, BookOpen, ChartNoAxesCombined, ClipboardCheck, Droplets, Library, Loader2, LogIn, ShieldCheck } from 'lucide-react'
import { ApiError } from '@/lib/api'

const FEATURES = [
  { icon: BookOpen, title: 'landing.courses', description: 'landing.coursesDesc' },
  { icon: ClipboardCheck, title: 'landing.assessment', description: 'landing.assessmentDesc' },
  { icon: ChartNoAxesCombined, title: 'landing.monitoring', description: 'landing.monitoringDesc' },
  { icon: Library, title: 'landing.library', description: 'landing.libraryDesc' },
  { icon: Award, title: 'landing.certificates', description: 'landing.certificatesDesc' },
] as const

export function LoginView() {
  const login = useAuth((state) => state.login)
  const loading = useAuth((state) => state.loading)
  const navigate = useNav((state) => state.navigate)
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    try {
      await login(email.trim(), password)
    } catch (reason) {
      setError(reason instanceof ApiError ? reason.message : t('auth.invalidCredentials'))
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto grid min-h-screen max-w-[1600px] lg:grid-cols-[minmax(0,1.2fr)_minmax(390px,0.8fr)]">
        <section className="relative overflow-hidden border-b border-slate-200 bg-slate-950 px-5 py-7 text-white sm:px-10 lg:border-b-0 lg:border-r lg:px-14 lg:py-10">
          <div className="absolute inset-x-0 top-0 h-1 bg-cyan-500" />
          <div className="relative flex h-full flex-col">
            <header className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-cyan-400/30 bg-cyan-400/10">
                  <Droplets className="h-6 w-6 text-cyan-300" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-lg font-semibold tracking-tight">{t('app.name')}</p>
                  <p className="truncate text-xs text-slate-400">{t('app.institution')}</p>
                </div>
              </div>
              <LanguageSwitcher />
            </header>

            <div className="my-auto py-12 lg:py-16">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">{t('landing.eyebrow')}</p>
              <h1 className="max-w-3xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                {t('landing.title')}
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">{t('landing.description')}</p>

              <div className="mt-9 grid max-w-3xl gap-px overflow-hidden rounded-xl border border-slate-700 bg-slate-700 sm:grid-cols-2">
                {FEATURES.map(({ icon: Icon, title, description }) => (
                  <article key={title} className="bg-slate-900 p-4 sm:p-5">
                    <Icon className="mb-3 h-5 w-5 text-cyan-300" aria-hidden="true" />
                    <h2 className="text-sm font-semibold text-white">{t(title)}</h2>
                    <p className="mt-1 text-xs leading-5 text-slate-400">{t(description)}</p>
                  </article>
                ))}
                <article className="flex items-center gap-3 bg-slate-900 p-4 sm:p-5">
                  <ShieldCheck className="h-7 w-7 shrink-0 text-emerald-300" aria-hidden="true" />
                  <p className="text-xs leading-5 text-slate-300">{t('landing.accessNote')}</p>
                </article>
              </div>
            </div>

            <footer className="text-xs text-slate-500">{t('app.footer')}</footer>
          </div>
        </section>

        <section className="flex items-center justify-center px-5 py-10 sm:px-10 lg:px-14" aria-labelledby="login-title">
          <div className="w-full max-w-md">
            <div className="mb-7 lg:hidden">
              <p className="text-sm font-medium text-slate-600">{t('landing.eyebrow')}</p>
            </div>
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-5">
                <CardTitle id="login-title" className="text-2xl">{t('auth.login')}</CardTitle>
                <CardDescription>{t('auth.loginSubtitle')}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('auth.email')}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                      maxLength={254}
                      autoComplete="username"
                      inputMode="email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">{t('auth.password')}</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                      maxLength={256}
                      autoComplete="current-password"
                    />
                  </div>

                  {error && (
                    <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                      {error}
                    </p>
                  )}

                  <Button type="submit" className="min-h-11 w-full" disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" /> : <LogIn className="mr-2 h-4 w-4" aria-hidden="true" />}
                    {loading ? t('common.loading') : t('auth.loginButton')}
                  </Button>
                </form>

                <div className="mt-6 border-t border-slate-200 pt-5">
                  <Button type="button" variant="outline" className="w-full" onClick={() => navigate('certificate-verify')}>
                    <Award className="mr-2 h-4 w-4" aria-hidden="true" />
                    {t('landing.verify')}
                  </Button>
                  <p className="mt-4 text-center text-xs leading-5 text-slate-500">{t('landing.accessNote')}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </main>
  )
}
