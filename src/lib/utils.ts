import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function initials(firstName?: string | null, lastName?: string | null): string {
  return `${firstName?.trim()[0] ?? ''}${lastName?.trim()[0] ?? ''}`.toUpperCase() || '?'
}

export function personName(user: { firstName: string; lastName: string; middleName?: string | null }, withMiddle = false): string {
  return [user.lastName, user.firstName, withMiddle ? user.middleName : null].filter(Boolean).join(' ')
}
