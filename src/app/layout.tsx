import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { getRequestLocale } from '@/i18n/server'
import { Providers } from './providers'
import './globals.css'

const inter = Inter({ subsets: ['latin', 'latin-ext', 'cyrillic'], variable: '--font-inter', display: 'swap' })

export const metadata: Metadata = {
  title: { default: 'GidroEdu LMS', template: '%s · GidroEdu LMS' },
  description: 'Gidrometeorologiya mutaxassislari uchun malaka oshirish platformasi: kurslar, testlar, kutubxona va tekshiriladigan sertifikatlar.',
  applicationName: 'GidroEdu LMS',
  icons: { icon: '/logo.svg' },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f7f9fc' },
    { media: '(prefers-color-scheme: dark)', color: '#0f1624' },
  ],
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getRequestLocale()
  return (
    <html lang={locale} suppressHydrationWarning className={inter.variable}>
      <body className="min-h-dvh font-sans">
        <Providers locale={locale}>{children}</Providers>
      </body>
    </html>
  )
}
