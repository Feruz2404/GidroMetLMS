// Server-side authorization policies. The role matrix itself lives in
// `@/shared/roles` so the client can mirror it for navigation; every decision
// that protects data is made here.
import { forbidden } from '@/server/http/errors'
import {
  hasPermission,
  isAdminRole,
  isInstructorRole,
  isManagerRole,
  PERMISSIONS,
  type Permission,
} from '@/shared/roles'

export * from '@/shared/roles'

export interface Actor {
  id: string
  role: string
  department: string | null
}

export function requirePermission(actor: Actor, permission: Permission): void {
  if (!hasPermission(actor.role, permission)) throw forbidden()
}

export function requireAnyPermission(actor: Actor, ...permissions: Permission[]): void {
  if (!permissions.some((permission) => hasPermission(actor.role, permission))) throw forbidden()
}

interface OwnedCourse {
  tutorId: string | null
  createdBy: string
}

export function canManageCourse(actor: Actor, course: OwnedCourse): boolean {
  if (hasPermission(actor.role, PERMISSIONS.COURSES_MANAGE_ALL)) return true
  return (
    hasPermission(actor.role, PERMISSIONS.COURSES_MANAGE_OWN) &&
    (course.tutorId === actor.id || course.createdBy === actor.id)
  )
}

export function assertCanManageCourse(actor: Actor, course: OwnedCourse): void {
  if (!canManageCourse(actor, course)) throw forbidden()
}

interface OwnedQuiz {
  createdBy: string
  course: OwnedCourse | null
}

export function canManageQuiz(actor: Actor, quiz: OwnedQuiz): boolean {
  if (!hasPermission(actor.role, PERMISSIONS.ASSESSMENTS_MANAGE)) return false
  if (isAdminRole(actor.role)) return true
  return quiz.createdBy === actor.id || (quiz.course !== null && canManageCourse(actor, quiz.course))
}

export function canManageResource(actor: Actor, resource: { uploadedBy: string }): boolean {
  if (!hasPermission(actor.role, PERMISSIONS.LIBRARY_MANAGE)) return false
  return !isInstructorRole(actor.role) || resource.uploadedBy === actor.id
}

/** Department managers only ever see their own department; a missing department denies access. */
export function requireManagerDepartment(actor: Actor): string {
  if (!isManagerRole(actor.role)) throw forbidden()
  if (!actor.department) throw forbidden('DEPARTMENT_SCOPE_MISSING', 'Department scope is not configured')
  return actor.department
}
