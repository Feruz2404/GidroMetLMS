import type { CurrentUserDto, UserListItemDto } from '@/shared/dto'
import { isSuperAdminRole } from '@/shared/roles'

const CHARSETS = {
  lower: 'abcdefghijkmnopqrstuvwxyz',
  upper: 'ABCDEFGHJKLMNPQRSTUVWXYZ',
  digit: '23456789',
  symbol: '!@#$%&*-_=+?',
} as const

/** Unbiased random integer in [0, max) from the Web Crypto API. */
function randomInt(max: number): number {
  const limit = Math.floor(0x1_0000_0000 / max) * max
  const buffer = new Uint32Array(1)
  do {
    crypto.getRandomValues(buffer)
  } while (buffer[0] >= limit)
  return buffer[0] % max
}

/**
 * Strong temporary password that always satisfies the server policy (one of
 * each character class). Look-alike characters (l, I, O, 0, 1) are excluded
 * because these passwords are often read out or retyped.
 */
export function generatePassword(length = 16): string {
  const pick = (chars: string) => chars[randomInt(chars.length)]
  const all = Object.values(CHARSETS).join('')
  const chars = Object.values(CHARSETS).map(pick)
  while (chars.length < length) chars.push(pick(all))
  for (let index = chars.length - 1; index > 0; index--) {
    const swap = randomInt(index + 1)
    const current = chars[index]
    chars[index] = chars[swap]
    chars[swap] = current
  }
  return chars.join('')
}

/** Username proposal derived from the local part of an email address. */
export function suggestUsername(email: string): string {
  return (email.split('@')[0] ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '.')
    .replace(/^[._-]+|[._-]+$/g, '')
    .slice(0, 64)
}

export const USERNAME_PATTERN = /^[a-z0-9._-]{3,64}$/
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** What the signed-in administrator may do with a user (mirrors the server rules). */
export function userAccess(actor: CurrentUserDto, target: UserListItemDto) {
  const isSelf = actor.id === target.id
  const manageable = !isSuperAdminRole(target.role) || isSuperAdminRole(actor.role)
  return {
    isSelf,
    canEdit: manageable,
    canChangeRole: manageable && !isSelf && !isSuperAdminRole(target.role),
    canResetPassword: manageable && !isSelf,
    canToggleStatus: manageable && !isSelf,
  }
}

export type UserAccess = ReturnType<typeof userAccess>
