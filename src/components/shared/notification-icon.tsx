import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const STYLES = {
  info: { icon: Info, className: 'bg-info/12 text-info' },
  success: { icon: CheckCircle2, className: 'bg-success/12 text-success' },
  warning: { icon: AlertTriangle, className: 'bg-warning/20 text-warning-foreground dark:text-warning' },
  error: { icon: XCircle, className: 'bg-destructive/10 text-destructive' },
} as const

export function NotificationIcon({ type, className }: { type: string; className?: string }) {
  const style = STYLES[type as keyof typeof STYLES] ?? STYLES.info
  const Icon = style.icon
  return (
    <span className={cn('flex size-8 shrink-0 items-center justify-center rounded-full', style.className, className)}>
      <Icon className="size-4" aria-hidden="true" />
    </span>
  )
}
