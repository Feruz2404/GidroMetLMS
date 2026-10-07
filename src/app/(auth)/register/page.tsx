import type { Metadata } from 'next'
import { RegisterForm } from '@/features/auth/register-form'
import { isRegistrationOpen } from '@/server/modules/auth/service'
import { listDepartments } from '@/server/modules/users/service'

export const metadata: Metadata = { title: 'Ro‘yxatdan o‘tish' }

export default async function RegisterPage() {
  const open = isRegistrationOpen()
  const departments = open ? await listDepartments().catch(() => []) : []
  return <RegisterForm open={open} departments={departments} />
}
