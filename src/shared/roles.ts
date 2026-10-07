// Role and permission matrix shared by the server (authorization) and the
// client (navigation and conditional UI). The server is always the authority;
// the client copy only decides what to show.

export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMINISTRATOR: 'administrator',
  INSTRUCTOR: 'instructor',
  DEPARTMENT_MANAGER: 'department_manager',
  LEARNER: 'learner',
  // Legacy values stay valid while older production records are migrated.
  LEGACY_ADMIN: 'admin',
  LEGACY_INSTRUCTOR: 'tutor',
  LEGACY_LEARNER: 'student',
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

/** Roles an administrator may assign through the UI/API (super admins are bootstrapped only). */
export const ASSIGNABLE_ROLES = [ROLES.ADMINISTRATOR, ROLES.INSTRUCTOR, ROLES.DEPARTMENT_MANAGER, ROLES.LEARNER] as const
export type AssignableRole = (typeof ASSIGNABLE_ROLES)[number]

export const LEARNER_ROLES: readonly string[] = [ROLES.LEARNER, ROLES.LEGACY_LEARNER]
export const INSTRUCTOR_ROLES: readonly string[] = [ROLES.INSTRUCTOR, ROLES.LEGACY_INSTRUCTOR]
export const ADMIN_ROLES: readonly string[] = [ROLES.SUPER_ADMIN, ROLES.ADMINISTRATOR, ROLES.LEGACY_ADMIN]

export const PERMISSIONS = {
  SYSTEM_MANAGE: 'system.manage',
  USERS_MANAGE: 'users.manage',
  ORGANIZATION_MANAGE: 'organization.manage',
  COURSES_MANAGE_ALL: 'courses.manage_all',
  COURSES_MANAGE_OWN: 'courses.manage_own',
  LEARNING_USE: 'learning.use',
  ASSESSMENTS_MANAGE: 'assessments.manage',
  ASSIGNMENTS_GRADE: 'assignments.grade',
  CERTIFICATES_MANAGE: 'certificates.manage',
  LIBRARY_MANAGE: 'library.manage',
  REPORTS_VIEW_ALL: 'reports.view_all',
  REPORTS_VIEW_DEPARTMENT: 'reports.view_department',
  ANNOUNCEMENTS_MANAGE: 'announcements.manage',
  AUDIT_VIEW: 'audit.view',
} as const

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]

const ADMIN_PERMISSIONS: Permission[] = [
  PERMISSIONS.USERS_MANAGE,
  PERMISSIONS.ORGANIZATION_MANAGE,
  PERMISSIONS.COURSES_MANAGE_ALL,
  PERMISSIONS.ASSESSMENTS_MANAGE,
  PERMISSIONS.ASSIGNMENTS_GRADE,
  PERMISSIONS.CERTIFICATES_MANAGE,
  PERMISSIONS.LIBRARY_MANAGE,
  PERMISSIONS.REPORTS_VIEW_ALL,
  PERMISSIONS.ANNOUNCEMENTS_MANAGE,
  PERMISSIONS.AUDIT_VIEW,
]

const INSTRUCTOR_PERMISSIONS: Permission[] = [
  PERMISSIONS.COURSES_MANAGE_OWN,
  PERMISSIONS.ASSESSMENTS_MANAGE,
  PERMISSIONS.ASSIGNMENTS_GRADE,
  PERMISSIONS.LIBRARY_MANAGE,
]

const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  [ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS),
  [ROLES.ADMINISTRATOR]: ADMIN_PERMISSIONS,
  [ROLES.LEGACY_ADMIN]: ADMIN_PERMISSIONS,
  [ROLES.INSTRUCTOR]: INSTRUCTOR_PERMISSIONS,
  [ROLES.LEGACY_INSTRUCTOR]: INSTRUCTOR_PERMISSIONS,
  [ROLES.DEPARTMENT_MANAGER]: [PERMISSIONS.REPORTS_VIEW_DEPARTMENT],
  [ROLES.LEARNER]: [PERMISSIONS.LEARNING_USE],
  [ROLES.LEGACY_LEARNER]: [PERMISSIONS.LEARNING_USE],
}

export function isRole(value: string): value is Role {
  return Object.values(ROLES).includes(value as Role)
}

export function hasPermission(role: string, permission: Permission): boolean {
  return isRole(role) && ROLE_PERMISSIONS[role].includes(permission)
}

export const isSuperAdminRole = (role: string) => role === ROLES.SUPER_ADMIN
export const isAdminRole = (role: string) => ADMIN_ROLES.includes(role)
export const isInstructorRole = (role: string) => INSTRUCTOR_ROLES.includes(role)
export const isManagerRole = (role: string) => role === ROLES.DEPARTMENT_MANAGER
export const isLearnerRole = (role: string) => LEARNER_ROLES.includes(role)
export const isStaffRole = (role: string) => isAdminRole(role) || isInstructorRole(role) || isManagerRole(role)

/** Maps legacy role values to their canonical equivalent for display. */
export function canonicalRole(role: string): Role {
  if (role === ROLES.LEGACY_ADMIN) return ROLES.ADMINISTRATOR
  if (role === ROLES.LEGACY_INSTRUCTOR) return ROLES.INSTRUCTOR
  if (role === ROLES.LEGACY_LEARNER) return ROLES.LEARNER
  return isRole(role) ? role : ROLES.LEARNER
}

export function canManageContent(role: string): boolean {
  return hasPermission(role, PERMISSIONS.COURSES_MANAGE_ALL) || hasPermission(role, PERMISSIONS.COURSES_MANAGE_OWN)
}

export function canViewReports(role: string): boolean {
  return (
    hasPermission(role, PERMISSIONS.REPORTS_VIEW_ALL) ||
    hasPermission(role, PERMISSIONS.REPORTS_VIEW_DEPARTMENT) ||
    hasPermission(role, PERMISSIONS.COURSES_MANAGE_OWN)
  )
}
