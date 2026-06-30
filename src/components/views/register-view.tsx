'use client'

import { useState } from 'react'
import { useNav } from '@/store/auth'
import { useTranslation } from '@/lib/i18n'
import { LanguageSwitcher } from '@/components/app/language-switcher'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Droplets, Loader2, UserPlus, Shield, ArrowLeft } from 'lucide-react'
import { ApiError, api } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'

const ONEID_ENABLED = false

export function RegisterView() {
  const navigate = useNav((s) => s.navigate)
  const { t } = useTranslation()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    middleName: '',
    phone: '',
    department: '',
    position: '',
    role: 'student',
  })
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setError(t('auth.passwordMismatch'))
      return
    }
    if (form.password.length < 6) {
      setError(t('auth.passwordTooShort'))
      return
    }

    setLoading(true)
    try {
      const { confirmPassword: _confirmPassword, ...data } = form
      await api.post('/auth/register', data)
      toast({ title: t('auth.accountCreated') })
      navigate('dashboard')
      // Trigger a re-render to show login
      window.location.reload()
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.statusCode === 409 ? t('auth.emailExists') : err.message)
      } else {
        setError(t('auth.registerError'))
      }
    } finally {
      setLoading(false)
    }
  }

  const handleOneID = () => {
    if (!ONEID_ENABLED) {
      toast({ title: t('auth.oneidDisabled'), description: t('auth.oneidComingSoon') })
      return
    }
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
          <h2 className="text-3xl lg:text-4xl font-bold leading-tight mb-4">
            {t('auth.register')}
          </h2>
          <p className="text-teal-100 text-base lg:text-lg max-w-md">
            {t('auth.registerSubtitle')}
          </p>
        </div>

        <div className="relative z-10 text-xs text-teal-200">
          {t('app.footer')}
        </div>
      </div>

      {/* Right — Register form */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-muted/30">
        <div className="w-full max-w-md max-h-[90vh] overflow-y-auto scroll-area">
          <Card className="shadow-xl border-border/60">
            <CardHeader className="space-y-1">
              <button
                onClick={() => navigate('dashboard')}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
              >
                <ArrowLeft className="w-4 h-4" /> {t('auth.haveAccount')}
              </button>
              <CardTitle className="text-2xl">{t('auth.registerButton')}</CardTitle>
              <CardDescription>{t('auth.registerSubtitle')}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>{t('auth.firstName')} *</Label>
                    <Input
                      required
                      value={form.firstName}
                      onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('auth.lastName')} *</Label>
                    <Input
                      required
                      value={form.lastName}
                      onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('auth.middleName')}</Label>
                    <Input
                      value={form.middleName}
                      onChange={(e) => setForm({ ...form, middleName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('auth.phone')}</Label>
                    <Input
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+998901234567"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{t('auth.email')} *</Label>
                  <Input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>{t('auth.username')} *</Label>
                  <Input
                    required
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>{t('auth.password')} *</Label>
                    <Input
                      type="password"
                      required
                      minLength={6}
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('auth.confirmPassword')} *</Label>
                    <Input
                      type="password"
                      required
                      minLength={6}
                      value={form.confirmPassword}
                      onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>{t('users.department')}</Label>
                    <Input
                      value={form.department}
                      onChange={(e) => setForm({ ...form, department: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('auth.position')}</Label>
                    <Input
                      value={form.position}
                      onChange={(e) => setForm({ ...form, position: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{t('auth.role')}</Label>
                  <Select
                    value={form.role}
                    onValueChange={(v) => setForm({ ...form, role: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">{t('role.student')}</SelectItem>
                    </SelectContent>
                  </Select>
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
                    <><UserPlus className="w-4 h-4 mr-2" /> {t('auth.registerButton')}</>
                  )}
                </Button>
              </form>

              {/* OneID */}
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
                {!ONEID_ENABLED && (
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    {t('auth.oneidComingSoon')}
                  </p>
                )}
              </div>

              <div className="mt-4 text-center text-sm text-muted-foreground">
                {t('auth.haveAccount')}{' '}
                <button
                  onClick={() => navigate('dashboard')}
                  className="font-medium text-primary hover:underline"
                >
                  {t('auth.login')}
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
