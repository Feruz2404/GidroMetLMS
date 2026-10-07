'use client'

import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sonner'
import { ApiError, onUnauthorized } from '@/lib/api-client'
import type { Locale } from '@/i18n/config'
import { I18nProvider } from '@/i18n/provider'
import { TooltipProvider } from '@/components/ui/tooltip'

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        refetchOnWindowFocus: false,
        // Client errors (4xx) will not fix themselves; only retry transient failures.
        retry: (failureCount, error) => !(error instanceof ApiError && error.status >= 400 && error.status < 500) && failureCount < 2,
      },
    },
  })
}

export function Providers({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const [queryClient] = useState(() => {
    const client = createQueryClient()
    onUnauthorized(() => {
      client.clear()
      const next = window.location.pathname + window.location.search
      if (!window.location.pathname.startsWith('/login')) window.location.assign(`/login?next=${encodeURIComponent(next)}&expired=1`)
    })
    return client
  })

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <I18nProvider initialLocale={locale}>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider delayDuration={200}>
            {children}
            <Toaster richColors closeButton position="top-right" toastOptions={{ className: 'font-sans' }} />
          </TooltipProvider>
        </QueryClientProvider>
      </I18nProvider>
    </ThemeProvider>
  )
}
