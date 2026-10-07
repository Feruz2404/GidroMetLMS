import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn, initials } from '@/lib/utils'

const PALETTE = ['bg-sky-100 text-sky-700', 'bg-indigo-100 text-indigo-700', 'bg-emerald-100 text-emerald-700', 'bg-amber-100 text-amber-800', 'bg-rose-100 text-rose-700', 'bg-violet-100 text-violet-700', 'bg-teal-100 text-teal-700']

function paletteFor(seed: string) {
  let hash = 0
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  return PALETTE[hash % PALETTE.length]
}

interface UserAvatarProps {
  user: { id?: string; firstName: string; lastName: string; avatarUrl?: string | null }
  className?: string
}

export function UserAvatar({ user, className }: UserAvatarProps) {
  return (
    <Avatar className={cn('size-9', className)}>
      {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt="" />}
      <AvatarFallback className={cn('text-xs font-semibold dark:bg-opacity-20', paletteFor(user.id ?? user.lastName))}>
        {initials(user.firstName, user.lastName)}
      </AvatarFallback>
    </Avatar>
  )
}
