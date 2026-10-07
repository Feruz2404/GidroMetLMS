import type { Prisma } from '@prisma/client'
import { audit } from '@/server/audit'
import { hashPassword } from '@/server/auth/password'
import { isSuperAdminRole, requirePermission, type Actor } from '@/server/auth/permissions'
import { revokeAllSessions } from '@/server/auth/session'
import { db } from '@/server/db'
import { badRequest, conflict, forbidden, found } from '@/server/http/errors'
import { ilike, pageMeta, skipTake } from '@/server/http/request'
import type { DepartmentDto, UserDetailDto } from '@/shared/dto'
import { ADMIN_ROLES, INSTRUCTOR_ROLES, LEARNER_ROLES, PERMISSIONS, ROLES } from '@/shared/roles'
import type { CreateUserInput, UpdateUserInput } from '@/shared/schemas'
import { toUserListItem, userListSelect } from './mapper'

export interface UserListQuery {
  search?: string
  role?: string
  status?: 'active' | 'inactive'
  department?: string
  page: number
  limit: number
}

const ROLE_GROUPS: Record<string, readonly string[]> = {
  [ROLES.ADMINISTRATOR]: ADMIN_ROLES,
  [ROLES.INSTRUCTOR]: INSTRUCTOR_ROLES,
  [ROLES.LEARNER]: LEARNER_ROLES,
  [ROLES.DEPARTMENT_MANAGER]: [ROLES.DEPARTMENT_MANAGER],
}

export async function listUsers(actor: Actor, query: UserListQuery) {
  requirePermission(actor, PERMISSIONS.USERS_MANAGE)
  const where: Prisma.UserWhereInput = {}
  if (query.search) {
    where.OR = [
      { firstName: ilike(query.search) },
      { lastName: ilike(query.search) },
      { email: ilike(query.search) },
      { username: ilike(query.search) },
      { position: ilike(query.search) },
    ]
  }
  if (query.role) where.role = { in: [...(ROLE_GROUPS[query.role] ?? [query.role])] }
  if (query.status) where.isActive = query.status === 'active'
  if (query.department) where.department = query.department

  const [total, users] = await Promise.all([
    db.user.count({ where }),
    db.user.findMany({
      where,
      select: userListSelect,
      orderBy: [{ isActive: 'desc' }, { lastName: 'asc' }, { firstName: 'asc' }],
      ...skipTake(query.page, query.limit),
    }),
  ])
  return { items: users.map(toUserListItem), meta: pageMeta(total, query.page, query.limit) }
}

export async function getUser(actor: Actor, id: string): Promise<UserDetailDto> {
  requirePermission(actor, PERMISSIONS.USERS_MANAGE)
  const user = found(await db.user.findUnique({ where: { id }, select: userListSelect }), 'User')
  const [enrollments, completedCourses, certificates, quizAttempts] = await Promise.all([
    db.enrollment.count({ where: { userId: id } }),
    db.enrollment.count({ where: { userId: id, status: 'completed' } }),
    db.certificate.count({ where: { userId: id, status: 'active' } }),
    db.quizAttempt.count({ where: { userId: id, status: 'graded' } }),
  ])
  return { ...toUserListItem(user), stats: { enrollments, completedCourses, certificates, quizAttempts } }
}

export async function createUser(actor: Actor, input: CreateUserInput, req: Request) {
  requirePermission(actor, PERMISSIONS.USERS_MANAGE)
  const existing = await db.user.findFirst({
    where: { OR: [{ email: input.email }, { username: input.username }] },
    select: { id: true },
  })
  if (existing) throw conflict('USER_EXISTS', 'Email or username already exists')

  const { password, ...profile } = input
  const user = await db.user.create({
    data: {
      ...profile,
      passwordHash: await hashPassword(password),
      // Administrator-issued passwords are temporary by policy.
      mustChangePassword: true,
      emailVerifiedAt: new Date(),
    },
    select: userListSelect,
  })
  await audit({ userId: actor.id, action: 'create_user', entity: 'user', entityId: user.id, metadata: { role: user.role }, request: req })
  return toUserListItem(user)
}

async function findManageableUser(actor: Actor, id: string) {
  const user = found(await db.user.findUnique({ where: { id } }), 'User')
  // Super administrators are managed only through the bootstrap tooling.
  if (isSuperAdminRole(user.role) && !isSuperAdminRole(actor.role)) throw forbidden()
  return user
}

export async function updateUser(actor: Actor, id: string, input: UpdateUserInput, req: Request) {
  requirePermission(actor, PERMISSIONS.USERS_MANAGE)
  const user = await findManageableUser(actor, id)
  if (input.role && id === actor.id) throw badRequest('CANNOT_MODIFY_SELF', 'You cannot change your own role')
  if (input.role && isSuperAdminRole(user.role)) throw forbidden()

  const updated = await db.user.update({ where: { id }, data: input, select: userListSelect })
  await audit({ userId: actor.id, action: 'update_user', entity: 'user', entityId: id, metadata: { fields: Object.keys(input) }, request: req })
  return toUserListItem(updated)
}

export async function setUserActive(actor: Actor, id: string, isActive: boolean, req: Request) {
  requirePermission(actor, PERMISSIONS.USERS_MANAGE)
  if (id === actor.id) throw badRequest('CANNOT_MODIFY_SELF', 'You cannot deactivate your own account')
  await findManageableUser(actor, id)

  const updated = await db.user.update({ where: { id }, data: { isActive }, select: userListSelect })
  if (!isActive) await revokeAllSessions(id)
  await audit({ userId: actor.id, action: isActive ? 'activate_user' : 'deactivate_user', entity: 'user', entityId: id, request: req })
  return toUserListItem(updated)
}

export async function resetUserPassword(actor: Actor, id: string, password: string, req: Request) {
  requirePermission(actor, PERMISSIONS.USERS_MANAGE)
  if (id === actor.id) throw badRequest('CANNOT_MODIFY_SELF', 'Use the profile page to change your own password')
  await findManageableUser(actor, id)

  const updated = await db.user.update({
    where: { id },
    data: { passwordHash: await hashPassword(password), mustChangePassword: true },
    select: userListSelect,
  })
  await revokeAllSessions(id)
  await audit({ userId: actor.id, action: 'reset_password', entity: 'user', entityId: id, request: req })
  return toUserListItem(updated)
}

export async function listDepartments(): Promise<DepartmentDto[]> {
  const departments = await db.department.findMany({ where: { isActive: true }, orderBy: { nameUz: 'asc' } })
  return departments.map((department) => ({ id: department.id, code: department.code, name: department.nameUz }))
}
