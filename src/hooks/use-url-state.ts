'use client'

import { useCallback } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

/**
 * Filter/pagination state stored in the URL, so lists are shareable and the
 * back button restores them. Setting a non-page key resets `page`.
 */
export function useUrlState<K extends string>(defaults: Record<K, string>) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const values = Object.fromEntries(
    (Object.keys(defaults) as K[]).map((key) => [key, searchParams.get(key) ?? defaults[key]])
  ) as Record<K, string>

  const set = useCallback(
    (patch: Partial<Record<K, string | number | null>>) => {
      const params = new URLSearchParams(searchParams.toString())
      for (const [key, value] of Object.entries(patch) as Array<[K, string | number | null | undefined]>) {
        if (value === null || value === undefined || value === '' || String(value) === defaults[key]) params.delete(key)
        else params.set(key, String(value))
      }
      if (!('page' in patch)) params.delete('page')
      const query = params.toString()
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
    },
    [defaults, pathname, router, searchParams]
  )

  return [values, set] as const
}
