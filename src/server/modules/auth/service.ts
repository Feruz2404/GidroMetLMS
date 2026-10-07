import { audit } from '@/server/audit'
import { hashPassword, needsPasswordRehash, verifyPassword } from '@/server/auth/password'
import { consumeRateLimit, resetRateLimit } from '@/server/auth/rate-limit'
import { createSession, revokeAllSessions, revokeSession, type SessionUser } from '@/server/auth/session'
import { db } from '@/server/db'
import { AppError, badRequest, conflict, forbidden } from '@/server/http/errors'
import { getClientIp, getUserAgent } from '@/server/http/request'
import { toCurrentUser } from '@/server/modules/users/mapper'
import { notify } from '@/server/modules/notifications/service'
import { ROLES } from '@/shared/roles'
import type {
  ChangePasswordInput,
  LoginInput,
  ProfileUpdateInput,
  RegistrationInput,
} from '@/shared/schemas'

export function isRegistrationOpen(env = process.env): boolean {
  return env.NODE_ENV !== 'production' || env.ALLOW_PUBLIC_REGISTRATION === 'true'
}

export async function login(input: LoginInput, req: Request) {
  const ip = getClientIp(req)
  const rateKey = `login:${ip}:${input.email}`
  const limit = consumeRateLimit(rateKey)
  if (!limit.allowed) {
    throw new AppError(429, 'RATE_LIMITED', 'Too many attempts', { retryAfterSeconds: limit.retryAfterSeconds })
  }

  const user = await db.user.findUnique({ where: { email: input.email } })
  // Same response for unknown e-mail, wrong password and disabled account to
  // avoid account enumeration.
  if (!user || !user.isActive || !(await verifyPassword(input.password, user.passwordHash))) {
    throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password')
  }
  resetRateLimit(rateKey)

  const token = await createSession(user.id, { ipAddress: ip, deviceInfo: getUserAgent(req) })
  const updated = await db.user.update({
    where: { id: user.id },
    data: {
      lastLoginAt: new Date(),
      ...(needsPasswordRehash(user.passwordHash) ? { passwordHash: await hashPassword(input.password) } : {}),
    },
  })
  await audit({ userId: user.id, action: 'login', entity: 'user', entityId: user.id, request: req })
  return { user: toCurrentUser(updated), token }
}

export async function register(input: RegistrationInput, req: Request) {
  if (!isRegistrationOpen()) throw forbidden('REGISTRATION_DISABLED', 'Public registration is disabled')

  const existing = await db.user.findFirst({
    where: { OR: [{ email: input.email }, { username: input.username }] },
    select: { id: true },
  })
  if (existing) throw conflict('USER_EXISTS', 'Email or username already exists')

  // Self-registration always creates a learner; staff accounts are provisioned by administrators.
  const user = await db.user.create({
    data: {
      email: input.email,
      username: input.username,
      passwordHash: await hashPassword(input.password),
      role: ROLES.LEARNER,
      firstName: input.firstName,
      lastName: input.lastName,
      middleName: input.middleName,
      phone: input.phone,
      department: input.department,
      position: input.position,
      lastLoginAt: new Date(),
    },
  })
  const token = await createSession(user.id, { ipAddress: getClientIp(req), deviceInfo: getUserAgent(req) })
  await audit({ userId: user.id, action: 'register', entity: 'user', entityId: user.id, request: req })
  await notify(user.id, {
    type: 'info',
    title: 'GidroEdu LMS ga xush kelibsiz!',
    message: 'Kurslar katalogidan o‘zingizga mos kursni tanlang va o‘qishni boshlang.',
    link: '/courses',
    eventKey: 'welcome',
  })
  return { user: toCurrentUser(user), token }
}

export async function logout(user: SessionUser | null, token: string | undefined, req: Request) {
  await revokeSession(token)
  if (user) await audit({ userId: user.id, action: 'logout', entity: 'user', entityId: user.id, request: req })
}

export async function updateProfile(user: SessionUser, input: ProfileUpdateInput) {
  const updated = await db.user.update({ where: { id: user.id }, data: input })
  return toCurrentUser(updated)
}

export async function changePassword(user: SessionUser, input: ChangePasswordInput, currentToken: string | undefined, req: Request) {
  if (!(await verifyPassword(input.currentPassword, user.passwordHash))) {
    throw badRequest('INVALID_CREDENTIALS', 'Current password is incorrect')
  }
  if (input.currentPassword === input.newPassword) {
    throw badRequest('WEAK_PASSWORD', 'The new password must differ from the current one')
  }
  const updated = await db.user.update({
    where: { id: user.id },
    data: { passwordHash: await hashPassword(input.newPassword), mustChangePassword: false },
  })
  // Sign out every other device; the current session stays valid.
  await revokeAllSessions(user.id, currentToken)
  await audit({ userId: user.id, action: 'change_password', entity: 'user', entityId: user.id, request: req })
  return toCurrentUser(updated)
}
