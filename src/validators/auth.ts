import { z } from 'zod'
import { isRole, ROLES } from '@/server/auth/permissions'

const normalizedEmail = z
  .string()
  .trim()
  .email()
  .max(254)
  .transform((value) => value.toLowerCase())

export const loginSchema = z.object({
  email: normalizedEmail,
  password: z.string().min(1).max(256),
})

export const passwordSchema = z
  .string()
  .min(12, 'Password must contain at least 12 characters')
  .max(256)
  .regex(/[a-z]/, 'Password must contain a lowercase letter')
  .regex(/[A-Z]/, 'Password must contain an uppercase letter')
  .regex(/[0-9]/, 'Password must contain a number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain a symbol')

export const publicRegistrationSchema = z.object({
  email: normalizedEmail,
  username: z.string().trim().toLowerCase().min(3).max(64).regex(/^[a-z0-9._-]+$/),
  password: passwordSchema,
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  middleName: z.string().trim().max(80).optional().nullable(),
  phone: z.string().trim().max(32).optional().nullable(),
})

export const adminRoleSchema = z.string().refine(isRole).refine((role) => role !== ROLES.SUPER_ADMIN, {
  message: 'Super administrator accounts require production-safe initialization',
})

export function formatValidationErrors(error: z.ZodError) {
  return error.issues.map((issue) => ({ path: issue.path.join('.'), message: issue.message }))
}
