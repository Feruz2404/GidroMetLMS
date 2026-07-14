export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMINISTRATOR: 'administrator',
  INSTRUCTOR: 'instructor',
  DEPARTMENT_MANAGER: 'department_manager',
  LEARNER: 'learner',
  // Legacy values remain valid while existing production records are migrated.
  LEGACY_ADMIN: 'admin',
  LEGACY_INSTRUCTOR: 'tutor',
  LEGACY_LEARNER: 'student',
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

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
]

const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  [ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS),
  [ROLES.ADMINISTRATOR]: ADMIN_PERMISSIONS,
  [ROLES.LEGACY_ADMIN]: ADMIN_PERMISSIONS,
  [ROLES.INSTRUCTOR]: [
    PERMISSIONS.COURSES_MANAGE_OWN,
    PERMISSIONS.ASSESSMENTS_MANAGE,
    PERMISSIONS.ASSIGNMENTS_GRADE,
    PERMISSIONS.LIBRARY_MANAGE,
  ],
  [ROLES.LEGACY_INSTRUCTOR]: [
    PERMISSIONS.COURSES_MANAGE_OWN,
    PERMISSIONS.ASSESSMENTS_MANAGE,
    PERMISSIONS.ASSIGNMENTS_GRADE,
    PERMISSIONS.LIBRARY_MANAGE,
  ],
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

export function isSuperAdminRole(role: string): boolean {
  return role === ROLES.SUPER_ADMIN
}

export function isAdminRole(role: string): boolean {
  return isSuperAdminRole(role) || role === ROLES.ADMINISTRATOR || role === ROLES.LEGACY_ADMIN
}

export function isInstructorRole(role: string): boolean {
  return role === ROLES.INSTRUCTOR || role === ROLES.LEGACY_INSTRUCTOR
}

export function isManagerRole(role: string): boolean {
  return role === ROLES.DEPARTMENT_MANAGER
}

export function isLearnerRole(role: string): boolean {
  return role === ROLES.LEARNER || role === ROLES.LEGACY_LEARNER
}

export function isStaffRole(role: string): boolean {
  return isAdminRole(role) || isInstructorRole(role) || isManagerRole(role)
}

export function canManageCourse(role: string, userId: string, course: { tutorId: string | null; createdBy: string }) {
  return isAdminRole(role) || (isInstructorRole(role) && (course.tutorId === userId || course.createdBy === userId))
}
