import type { Metadata } from 'next'
import { LoginForm } from '@/features/auth/login-form'
import { isRegistrationOpen } from '@/server/modules/auth/service'

export const metadata: Metadata = { title: 'Kirish' }

export default function LoginPage() {
  return <LoginForm registrationOpen={isRegistrationOpen()} />
}
