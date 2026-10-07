import type { User } from '@prisma/client'
import type { CurrentUserDto, UserListItemDto, UserSummaryDto } from '@/shared/dto'
import { canonicalRole, hasPermission, PERMISSIONS, type Permission } from '@/shared/roles'

type SummarySource = Pick<User, 'id' | 'firstName' | 'lastName' | 'middleName' | 'position' | 'department' | 'avatarUrl'>

export const userSummarySelect = {
  id: true,
  firstName: true,
  lastName: true,
  middleName: true,
  position: true,
  department: true,
  avatarUrl: true,
} as const

export function toUserSummary(user: SummarySource): UserSummaryDto {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    middleName: user.middleName,
    position: user.position,
    department: user.department,
    avatarUrl: user.avatarUrl,
  }
}

export function fullName(user: Pick<User, 'firstName' | 'lastName'> & { middleName?: string | null }): string {
  return [user.lastName, user.firstName, user.middleName].filter(Boolean).join(' ')
}

export function toCurrentUser(user: User): CurrentUserDto {
  const role = canonicalRole(user.role)
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    role,
    firstName: user.firstName,
    lastName: user.lastName,
    middleName: user.middleName,
    phone: user.phone,
    avatarUrl: user.avatarUrl,
    department: user.department,
    position: user.position,
    mustChangePassword: user.mustChangePassword,
    lastLoginAt: user.lastLoginAt?.toISOString() ?? null,
    createdAt: user.createdAt.toISOString(),
    permissions: (Object.values(PERMISSIONS) as Permission[]).filter((permission) => hasPermission(role, permission)),
  }
}

export const userListSelect = {
  id: true,
  email: true,
  username: true,
  role: true,
  firstName: true,
  lastName: true,
  middleName: true,
  phone: true,
  department: true,
  position: true,
  isActive: true,
  mustChangePassword: true,
  lastLoginAt: true,
  createdAt: true,
} as const

type ListSource = Pick<User, keyof typeof userListSelect>

export function toUserListItem(user: ListSource): UserListItemDto {
  return {
    ...user,
    role: canonicalRole(user.role),
    lastLoginAt: user.lastLoginAt?.toISOString() ?? null,
    createdAt: user.createdAt.toISOString(),
  }
}
