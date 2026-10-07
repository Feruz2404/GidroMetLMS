'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { BookOpen, FileText, Search, UserRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { useSession } from '@/features/auth/session'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { useI18n } from '@/i18n/provider'
import { api } from '@/lib/api-client'
import { routes } from '@/lib/routes'
import type { SearchResultsDto } from '@/shared/dto'
import { NAV_GROUPS } from './nav-config'

export function CommandSearch() {
  const { t } = useI18n()
  const { user } = useSession()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [term, setTerm] = useState('')
  const query = useDebouncedValue(term.trim(), 250)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setOpen((value) => !value)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const { data, isFetching } = useQuery({
    queryKey: ['search', query],
    queryFn: () => api.get<SearchResultsDto>('/search', { q: query }),
    enabled: open && query.length >= 2,
    staleTime: 60_000,
  })

  const go = (href: string) => {
    setOpen(false)
    setTerm('')
    router.push(href)
  }

  const pages = NAV_GROUPS.flatMap((group) => group.items).filter((item) => item.visible(user.role))

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="h-9 w-full max-w-sm justify-start gap-2 bg-card px-3 text-muted-foreground shadow-none sm:w-72"
      >
        <Search className="size-4" aria-hidden="true" />
        <span className="flex-1 truncate text-left font-normal">{t('search.title')}…</span>
        <kbd className="pointer-events-none hidden rounded border bg-muted px-1.5 font-mono text-[10px] font-medium sm:inline">{t('search.shortcut')}</kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen} title={t('search.title')} description={t('search.placeholder')} shouldFilter={false}>
        <CommandInput value={term} onValueChange={setTerm} placeholder={t('search.placeholder')} />
        <CommandList>
          {query.length >= 2 && !isFetching && <CommandEmpty>{t('state.noResults')}</CommandEmpty>}
          {query.length < 2 && (
            <CommandGroup heading={t('search.pages')}>
              {pages.map((page) => (
                <CommandItem key={page.href} value={page.href} onSelect={() => go(page.href)}>
                  <page.icon aria-hidden="true" />
                  {t(page.label)}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          {!!data?.courses.length && (
            <CommandGroup heading={t('search.courses')}>
              {data.courses.map((course) => (
                <CommandItem key={course.id} value={`course-${course.id}`} onSelect={() => go(routes.course(course.id))}>
                  <BookOpen aria-hidden="true" />
                  <span className="truncate">{course.title}</span>
                  {course.category && <span className="ml-auto truncate text-xs text-muted-foreground">{course.category}</span>}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          {!!data?.resources.length && (
            <>
              <CommandSeparator />
              <CommandGroup heading={t('search.resources')}>
                {data.resources.map((resource) => (
                  <CommandItem key={resource.id} value={`resource-${resource.id}`} onSelect={() => go(routes.resource(resource.id))}>
                    <FileText aria-hidden="true" />
                    <span className="truncate">{resource.title}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
          {!!data?.users.length && (
            <>
              <CommandSeparator />
              <CommandGroup heading={t('search.users')}>
                {data.users.map((found) => (
                  <CommandItem key={found.id} value={`user-${found.id}`} onSelect={() => go(`${routes.users}?search=${encodeURIComponent(found.email)}`)}>
                    <UserRound aria-hidden="true" />
                    <span className="truncate">{found.name}</span>
                    <span className="ml-auto truncate text-xs text-muted-foreground">{found.email}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}
