'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useToast } from '@/hooks/use-toast'
import { UserPlus, Search, Users as UsersIcon, ShieldCheck, ShieldOff, Loader2, Trash2, Edit } from 'lucide-react'
import { timeAgo } from '@/lib/api'
import { useAuth } from '@/store/auth'
import { useTranslation } from '@/lib/i18n'

interface UserRow {
  id: string
  email: string
  username: string
  role: string
  firstName: string
  lastName: string
  middleName?: string | null
  phone?: string | null
  department?: string | null
  position?: string | null
  isActive: boolean
  lastLoginAt?: string | null
  createdAt: string
}

const ROLE_COLORS: Record<string, string> = {
  admin: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  tutor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  student: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
}

export function UsersView() {
  const { t } = useTranslation()
  const me = useAuth((s) => s.user)!
  const { toast } = useToast()
  const [users, setUsers] = useState<UserRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [createOpen, setCreateOpen] = useState(false)
  const [editing, setEditing] = useState<UserRow | null>(null)
  const [deleting, setDeleting] = useState<UserRow | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const roleLabel = (role: string) => {
    if (role === 'admin') return t('role.admin')
    if (role === 'tutor') return t('role.tutor')
    return t('role.student')
  }

  const fetchUsers = async () => {
    Promise.resolve().then(() => setLoading(true))
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' })
      if (search) params.set('search', search)
      if (roleFilter !== 'all') params.set('role', roleFilter)
      if (statusFilter !== 'all') params.set('status', statusFilter)
      const res = await api.get<{ data: { users: UserRow[]; total: number; pages: number } }>(`/users?${params}`)
      setUsers(res.data.users)
      setTotal(res.data.total)
      setPages(res.data.pages)
    } catch {
      toast({ title: t('common.error'), description: t('users.loadFailed'), variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const t = setTimeout(fetchUsers, 300)
    return () => clearTimeout(t)
  }, [search, roleFilter, statusFilter, page])

  const toggleStatus = async (u: UserRow) => {
    setActionLoading(true)
    try {
      await api.patch(`/users/${u.id}/status`, { isActive: !u.isActive })
      toast({ title: u.isActive ? t('users.blockedToast') : t('users.activatedToast'), description: `${u.firstName} ${u.lastName}` })
      fetchUsers()
    } catch {
      toast({ title: t('common.error'), variant: 'destructive' })
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleting) return
    setActionLoading(true)
    try {
      await api.delete(`/users/${deleting.id}`)
      toast({ title: t('users.deletedToast'), description: t('users.deletedToastDesc').replace('{name}', `${deleting.firstName} ${deleting.lastName}`) })
      setDeleting(null)
      fetchUsers()
    } catch {
      toast({ title: t('common.error'), variant: 'destructive' })
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{t('users.title')}</h1>
          <p className="text-muted-foreground">{total} {t('users.subtitle')}</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button><UserPlus className="w-4 h-4 mr-2" /> {t('users.newUser')}</Button>
          </DialogTrigger>
          <CreateUserDialog onSuccess={() => { setCreateOpen(false); fetchUsers() }} />
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={t('users.searchPlaceholder')}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="pl-10"
          />
        </div>
        <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v); setPage(1) }}>
          <SelectTrigger className="w-full sm:w-44"><SelectValue placeholder={t('users.role')} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('common.allRoles')}</SelectItem>
            <SelectItem value="admin">{t('role.admin')}</SelectItem>
            <SelectItem value="tutor">{t('role.tutor')}</SelectItem>
            <SelectItem value="student">{t('role.student')}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1) }}>
          <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder={t('common.status')} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('common.all')}</SelectItem>
            <SelectItem value="active">{t('common.active')}</SelectItem>
            <SelectItem value="inactive">{t('common.inactive')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 flex items-center justify-center text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin mr-2" /> {t('common.loading')}
            </div>
          ) : (
            <div className="overflow-x-auto scroll-area">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('users.user')}</TableHead>
                    <TableHead>{t('users.role')}</TableHead>
                    <TableHead>{t('users.department')}</TableHead>
                    <TableHead className="text-center">{t('common.status')}</TableHead>
                    <TableHead>{t('users.lastLogin')}</TableHead>
                    <TableHead className="text-right">{t('common.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-9 h-9">
                            <AvatarFallback className={`text-xs ${ROLE_COLORS[u.role]}`}>
                              {(u.firstName?.[0] ?? '?')}{(u.lastName?.[0] ?? '?')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{u.firstName} {u.lastName}</div>
                            <div className="text-xs text-muted-foreground">{u.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${ROLE_COLORS[u.role]}`}>
                          {roleLabel(u.role)}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm">{u.department ?? '-'}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={u.isActive ? 'default' : 'destructive'}>
                          {u.isActive ? t('common.active') : t('common.inactive')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{u.lastLoginAt ? timeAgo(u.lastLoginAt) : t('common.never')}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => setEditing(u)} disabled={u.id === me.id} aria-label={t('common.edit')}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => toggleStatus(u)} disabled={u.id === me.id || actionLoading} aria-label={u.isActive ? t('users.block') : t('users.activate')}>
                            {u.isActive ? <ShieldOff className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => setDeleting(u)} disabled={u.id === me.id} aria-label={t('common.delete')}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {users.length === 0 && (
                <div className="p-12 text-center text-muted-foreground">
                  <UsersIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>{t('users.notFound')}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{t('common.page')} {page} {t('common.of')} {pages}</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>{t('common.prev')}</Button>
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page === pages}>{t('common.next')}</Button>
          </div>
        </div>
      )}

      {/* Edit dialog */}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        {editing && <EditUserDialog user={editing} onSuccess={() => { setEditing(null); fetchUsers() }} />}
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('users.deleteTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {deleting && `${deleting.firstName} ${deleting.lastName} ${t('users.deleteConfirm')} ${t('users.deleteDesc')}`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function CreateUserDialog({ onSuccess }: { onSuccess: () => void }) {
  const { t } = useTranslation()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    email: '', username: '', password: '', role: 'student',
    firstName: '', lastName: '', middleName: '', phone: '', department: '', position: '',
  })

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/users', form)
      toast({ title: t('users.created'), description: t('users.createdDesc').replace('{name}', `${form.firstName} ${form.lastName}`) })
      onSuccess()
    } catch (e) {
      toast({ title: t('common.error'), description: e instanceof Error ? e.message : t('users.createFailed'), variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{t('users.createTitle')}</DialogTitle>
        <DialogDescription>{t('users.createDesc')}</DialogDescription>
      </DialogHeader>
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>{t('auth.firstName')} *</Label>
            <Input required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>{t('auth.lastName')} *</Label>
            <Input required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>{t('auth.middleName')}</Label>
            <Input value={form.middleName} onChange={(e) => setForm({ ...form, middleName: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>{t('auth.phone')}</Label>
            <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+998901234567" />
          </div>
          <div className="space-y-2">
            <Label>{t('auth.email')} *</Label>
            <Input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>{t('auth.username')} *</Label>
            <Input required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>{t('auth.password')} *</Label>
            <Input type="password" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>{t('users.role')} *</Label>
            <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="student">{t('role.student')}</SelectItem>
                <SelectItem value="tutor">{t('role.tutor')}</SelectItem>
                <SelectItem value="admin">{t('role.admin')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>{t('users.department')}</Label>
            <Input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>{t('users.position')}</Label>
            <Input value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} {t('common.create')}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}

function EditUserDialog({ user, onSuccess }: { user: UserRow; onSuccess: () => void }) {
  const { t } = useTranslation()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    middleName: user.middleName ?? '',
    phone: user.phone ?? '',
    department: user.department ?? '',
    position: user.position ?? '',
    role: user.role,
  })

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.patch(`/users/${user.id}`, form)
      toast({ title: t('users.updatedToast'), description: t('users.updatedDesc') })
      onSuccess()
    } catch {
      toast({ title: t('common.error'), variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle>{t('users.editTitle')}</DialogTitle>
        <DialogDescription>{user.email}</DialogDescription>
      </DialogHeader>
      <form onSubmit={submit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2"><Label>{t('auth.firstName')}</Label><Input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} /></div>
          <div className="space-y-2"><Label>{t('auth.lastName')}</Label><Input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} /></div>
          <div className="space-y-2"><Label>{t('auth.middleName')}</Label><Input value={form.middleName} onChange={(e) => setForm({ ...form, middleName: e.target.value })} /></div>
          <div className="space-y-2"><Label>{t('auth.phone')}</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
          <div className="space-y-2"><Label>{t('users.department')}</Label><Input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} /></div>
          <div className="space-y-2"><Label>{t('users.position')}</Label><Input value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} /></div>
        </div>
        <div className="space-y-2">
          <Label>{t('users.role')}</Label>
          <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="student">{t('role.student')}</SelectItem>
              <SelectItem value="tutor">{t('role.tutor')}</SelectItem>
              <SelectItem value="admin">{t('role.admin')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} {t('common.save')}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
