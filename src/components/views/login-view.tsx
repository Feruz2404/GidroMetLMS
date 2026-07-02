'use client'

import { useState } from 'react'
import { useAuth, useNav } from '@/store/auth'
import { useTranslation } from '@/lib/i18n'
import { LanguageSwitcher } from '@/components/app/language-switcher'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Droplets, GraduationCap, BookOpen, Award, Loader2, LogIn, Shield } from 'lucide-react'
import { ApiError } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'

// Demo accounts are distributed by the administrator — never hardcode credentials in production

// OneID is disabled until credentials are provided in .env
const ONEID_ENABLED = false

export function LoginView() {
  const login = useAuth((s) => s.login)
  const loading = useAuth((s) => s.loading)
  const navigate = useNav((s) => s.navigate)
  const { t } = useTranslation()
  const { toast } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await login(email, password)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t('auth.invalidCredentials'))
    }
  }

  const handleOneID = () => {
    if (!ONEID_ENABLED) {
      toast({ title: t('auth.oneidDisabled'), description: t('auth.oneidComingSoon') })
      return
    }
    // Real OneID flow would redirect to: /api/auth/oneid
    // window.location.href = '/api/auth/oneid'
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left — Hero */}
      <div className="lg:w-1/2 bg-gradient-to-br from-teal-700 via-teal-800 to-cyan-900 text-white p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 -left-20 w-80 h-80 rounded-full bg-cyan-300 blur-3xl" />
        </div>
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center ring-1 ring-white/30">
              <Droplets className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl font-bold leading-tight">{t('app.name')}</h1>
              <p className="text-xs text-teal-100">{t('app.institution')}</p>
            </div>
          </div>
          <LanguageSwitcher />
        </div>

        <div className="relative z-10 my-8 lg:my-0">
          <h2 className="text-3xl lg:text-5xl font-bold leading-tight mb-4">
            {t('app.tagline')}
          </h2>
          <p className="text-teal-100 text-base lg:text-lg max-w-md mb-8">
            {t('app.institution')}
          </p>

          <div className="grid grid-cols-2 gap-4 max-w-md">
            {[
              { icon: BookOpen, value: '6+', key: 'nav.courses' },
              { icon: GraduationCap, value: '500', key: 'role.student' },
              { icon: Award, value: '∞', key: 'nav.certificates' },
              { icon: Droplets, value: '6', key: 'nav.dashboard' },
            ].map((s) => (
              <div key={s.key} className="bg-white/10 backdrop-blur rounded-xl p-4 ring-1 ring-white/20">
                <s.icon className="w-5 h-5 mb-2 text-teal-200" />
                <div className="text-2xl font-bold">{s.value}</div>
                <div className="text-xs text-teal-100">{t(s.key)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-xs text-teal-200">
          {t('app.footer')}
        </div>
      </div>

      {/* Right — Login form */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-muted/30">
        <div className="w-full max-w-md">
          <Card className="shadow-xl border-border/60">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">{t('auth.login')}</CardTitle>
              <CardDescription>{t('auth.loginSubtitle')}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t('auth.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@gidroedu.uz"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">{t('auth.password')}</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                </div>

                {error && (
                  <div className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2 border border-destructive/20">
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {t('common.loading')}</>
                  ) : (
                    <><LogIn className="w-4 h-4 mr-2" /> {t('auth.loginButton')}</>
                  )}
                </Button>
              </form>

              {/* OneID button */}
              <div className="mt-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">OneID</span>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full mt-3"
                  onClick={handleOneID}
                  disabled={!ONEID_ENABLED}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  {t('auth.oneidLogin')}
                </Button>
              </div>

              {/* Register link */}
              <div className="mt-4 text-center text-sm text-muted-foreground">
                {t('auth.noAccount')}{' '}
                <button
                  onClick={() => navigate('register')}
                  className="font-medium text-primary hover:underline"
                >
                  {t('auth.register')}
                </button>
              </div>

              {/* Demo note */}
              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-xs text-muted-foreground text-center">
                  {t('auth.demoAccountsNotice')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
