'use client'

import { useState } from 'react'
import { api } from '@/lib/api'
import { useAuth } from '@/store/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import { User, Lock, Bell, Palette, Database, Loader2, Save, Droplets } from 'lucide-react'
import { formatDate } from '@/lib/api'
import { useTranslation } from '@/lib/i18n'

export function SettingsView() {
  const { t } = useTranslation()
  const user = useAuth((s) => s.user)!
  const updateUser = useAuth((s) => s.updateUser)
  const { toast } = useToast()
  const [profileLoading, setProfileLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [notifSettings, setNotifSettings] = useState({ email: true, push: true, courseUpdates: true, newResources: false })

  const [profile, setProfile] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    middleName: user.middleName ?? '',
    phone: user.phone ?? '',
    department: user.department ?? '',
    position: user.position ?? '',
  })

  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' })

  const roleLabel = (role: string) => {
    return t(`role.${role}`)
  }

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileLoading(true)
    try {
      const res = await api.patch<{ data: typeof profile }>('/auth/me', profile)
      updateUser(res.data)
      toast({ title: t('settings.saved'), description: t('settings.profileSavedDesc') })
    } catch {
      toast({ title: t('settings.error'), variant: 'destructive' })
    } finally {
      setProfileLoading(false)
    }
  }

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwords.next !== passwords.confirm) {
      toast({ title: t('settings.error'), description: t('settings.passwordMismatch'), variant: 'destructive' })
      return
    }
    if (passwords.next.length < 6) {
      toast({ title: t('settings.error'), description: t('settings.passwordTooShort'), variant: 'destructive' })
      return
    }
    setPasswordLoading(true)
    try {
      await api.patch('/auth/me', { password: passwords.next, currentPassword: passwords.current })
      setPasswords({ current: '', next: '', confirm: '' })
      toast({ title: t('settings.passwordChanged'), description: t('settings.passwordSet') })
    } catch {
      toast({ title: t('settings.error'), description: t('settings.currentPasswordWrong'), variant: 'destructive' })
    } finally {
      setPasswordLoading(false)
    }
  }

  const notifItems = [
    { key: 'email', label: t('settings.emailNotif'), desc: t('settings.emailNotifDesc') },
    { key: 'push', label: t('settings.pushNotif'), desc: t('settings.pushNotifDesc') },
    { key: 'courseUpdates', label: t('settings.courseUpdates'), desc: t('settings.courseUpdatesDesc') },
    { key: 'newResources', label: t('settings.newResources'), desc: t('settings.newResourcesDesc') },
  ] as const

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t('settings.title')}</h1>
        <p className="text-muted-foreground">{t('settings.subtitle')}</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="flex flex-wrap h-auto">
          <TabsTrigger value="profile"><User className="w-4 h-4 mr-2" /> {t('settings.tab.profile')}</TabsTrigger>
          <TabsTrigger value="password"><Lock className="w-4 h-4 mr-2" /> {t('settings.tab.password')}</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="w-4 h-4 mr-2" /> {t('settings.tab.notifications')}</TabsTrigger>
          {['super_admin', 'administrator', 'admin'].includes(user.role) && <TabsTrigger value="system"><Database className="w-4 h-4 mr-2" /> {t('settings.tab.system')}</TabsTrigger>}
        </TabsList>

        {/* Profile */}
        <TabsContent value="profile">
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle>{t('settings.profileInfo')}</CardTitle>
              <CardDescription>{t('settings.profileDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="w-20 h-20">
                  <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                    {(user.firstName?.[0] ?? '?')}{(user.lastName?.[0] ?? '?')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-lg font-semibold">{user.firstName} {user.lastName}</div>
                  <div className="text-sm text-muted-foreground">{user.email}</div>
                  <Badge variant="secondary" className="mt-1">{roleLabel(user.role)}</Badge>
                </div>
              </div>

              <form onSubmit={saveProfile} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t('auth.firstName')}</Label>
                    <Input value={profile.firstName} onChange={(e) => setProfile({ ...profile, firstName: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('auth.lastName')}</Label>
                    <Input value={profile.lastName} onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('auth.middleName')}</Label>
                    <Input value={profile.middleName} onChange={(e) => setProfile({ ...profile, middleName: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('auth.phone')}</Label>
                    <Input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} placeholder="+998901234567" />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('users.department')}</Label>
                    <Input value={profile.department} onChange={(e) => setProfile({ ...profile, department: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('settings.position')}</Label>
                    <Input value={profile.position} onChange={(e) => setProfile({ ...profile, position: e.target.value })} />
                  </div>
                </div>
                <Separator />
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>{t('settings.emailLabel')}: {user.email} {t('settings.emailImmutable')}</div>
                  <div>{t('settings.usernameLabel')}: @{user.username}</div>
                  <div>{t('settings.registeredOn')}: {formatDate(user.createdAt)}</div>
                </div>
                <Button type="submit" disabled={profileLoading}>
                  {profileLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />} {t('common.save')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Password */}
        <TabsContent value="password">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>{t('settings.passwordChange')}</CardTitle>
              <CardDescription>{t('settings.passwordDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={changePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label>{t('settings.currentPassword')}</Label>
                  <Input type="password" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>{t('settings.newPassword')}</Label>
                  <Input type="password" value={passwords.next} onChange={(e) => setPasswords({ ...passwords, next: e.target.value })} required minLength={6} />
                </div>
                <div className="space-y-2">
                  <Label>{t('settings.confirmPassword')}</Label>
                  <Input type="password" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} required />
                </div>
                <Button type="submit" disabled={passwordLoading}>
                  {passwordLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Lock className="w-4 h-4 mr-2" />} {t('settings.passwordUpdate')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <Card className="max-w-lg">
            <CardHeader>
              <CardTitle>{t('settings.notifSettings')}</CardTitle>
              <CardDescription>{t('settings.notifDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* TODO: Notification settings are frontend-only. Need an API endpoint (e.g. PATCH /users/me/notification-settings) to persist preferences to the database. */}
              {notifItems.map((item) => (
                <div key={item.key} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div>
                    <div className="text-sm font-medium">{item.label}</div>
                    <div className="text-xs text-muted-foreground">{item.desc}</div>
                  </div>
                  <Button
                    variant={notifSettings[item.key as keyof typeof notifSettings] ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setNotifSettings({ ...notifSettings, [item.key]: !notifSettings[item.key as keyof typeof notifSettings] })}
                  >
                    {notifSettings[item.key as keyof typeof notifSettings] ? t('settings.enabled') : t('settings.disabled')}
                  </Button>
                </div>
              ))}
              <Button onClick={() => toast({ title: t('settings.saved'), description: t('settings.notifSavedDesc') })}>
                <Save className="w-4 h-4 mr-2" /> {t('settings.saveNotif')}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System (admin) */}
        {['super_admin', 'administrator', 'admin'].includes(user.role) && (
          <TabsContent value="system">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Database className="w-5 h-5" /> {t('settings.systemInfo')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">{t('settings.version')}:</span><span className="font-mono">1.0.0</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">{t('settings.framework')}:</span><span>Next.js 16</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">{t('settings.database')}:</span><span>PostgreSQL + Prisma</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">{t('settings.environment')}:</span><Badge variant="secondary">{t('settings.development')}</Badge></div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Palette className="w-5 h-5" /> {t('settings.systemSettings')}</CardTitle>
                </CardHeader>
                {/* NOTE: System settings values come from the database Setting model (see prisma schema). They should be loaded from an API endpoint like GET /settings. */}
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{t('settings.defaultPassRate')}</span>
                    <Badge variant="secondary">70%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{t('settings.maxFileSize')}</span>
                    <Badge variant="secondary">500 MB</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{t('settings.sessionTimeout')}</span>
                    <Badge variant="secondary">7 {t('common.days')}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{t('settings.backup')}</span>
                    <Badge variant="secondary">{t('settings.daily')}</Badge>
                  </div>
                </CardContent>
              </Card>
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Droplets className="w-5 h-5" /> {t('settings.platform')}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <p><strong className="text-foreground">{t('app.name')}</strong> — {t('settings.platformDesc')}</p>
                  <p>{t('settings.platformModules')}</p>
                  <p>{t('settings.allRightsReserved')}</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
