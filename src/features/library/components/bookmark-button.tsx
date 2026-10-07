'use client'

import { Bookmark } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/i18n/provider'
import { useErrorToast } from '@/lib/use-api-error'
import { cn } from '@/lib/utils'
import type { LibraryResourceDto } from '@/shared/dto'
import { useToggleBookmark } from '../api'

interface BookmarkButtonProps {
  resource: LibraryResourceDto
  /** `overlay` sits on a coloured cover; `full` shows a text label. */
  variant?: 'icon' | 'overlay' | 'full'
  className?: string
}

export function BookmarkButton({ resource, variant = 'icon', className }: BookmarkButtonProps) {
  const { t } = useI18n()
  const toggle = useToggleBookmark()
  const onError = useErrorToast()
  const label = resource.bookmarked ? t('library.bookmark.remove') : t('library.bookmark.add')

  const onClick = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    toggle.mutate(resource, {
      onSuccess: ({ bookmarked }) => toast.success(bookmarked ? t('library.bookmark.added') : t('library.bookmark.removed')),
      onError,
    })
  }

  const icon = <Bookmark className={cn(resource.bookmarked && 'fill-current')} aria-hidden="true" />

  if (variant === 'full') {
    return (
      <Button variant={resource.bookmarked ? 'soft' : 'outline'} onClick={onClick} aria-pressed={resource.bookmarked} className={className}>
        {icon}
        {resource.bookmarked ? t('library.bookmark.saved') : t('library.bookmark.add')}
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={onClick}
      aria-pressed={resource.bookmarked}
      aria-label={label}
      title={label}
      className={cn(
        variant === 'overlay'
          ? 'bg-white/15 text-white backdrop-blur-sm hover:bg-white/25 hover:text-white dark:hover:bg-white/25'
          : resource.bookmarked
            ? 'text-primary'
            : 'text-muted-foreground',
        className
      )}
    >
      {icon}
    </Button>
  )
}
