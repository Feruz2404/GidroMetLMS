import {
  BookMarked,
  BookOpen,
  FileText,
  Headphones,
  Newspaper,
  Presentation,
  Scale,
  Video,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ResourceType } from '@/shared/dto'

// Each type gets its own icon and cover colour so the shelf is scannable at a glance.
const TYPE_STYLES: Record<ResourceType, { icon: LucideIcon; cover: string }> = {
  book: { icon: BookOpen, cover: 'from-blue-500 to-indigo-700' },
  manual: { icon: BookMarked, cover: 'from-teal-500 to-cyan-700' },
  article: { icon: Newspaper, cover: 'from-violet-500 to-purple-700' },
  document: { icon: FileText, cover: 'from-sky-500 to-blue-700' },
  normative: { icon: Scale, cover: 'from-amber-500 to-orange-700' },
  presentation: { icon: Presentation, cover: 'from-orange-500 to-rose-600' },
  video: { icon: Video, cover: 'from-rose-500 to-pink-700' },
  audio: { icon: Headphones, cover: 'from-emerald-500 to-teal-700' },
}

function styleFor(type: string) {
  return TYPE_STYLES[type as ResourceType] ?? TYPE_STYLES.document
}

/** Small square thumbnail for list rows and compact references. */
export function ResourceThumb({ type, className }: { type: string; className?: string }) {
  const { icon: Icon, cover } = styleFor(type)
  return (
    <span className={cn('flex size-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-white shadow-sm', cover, className)}>
      <Icon className="size-[45%]" aria-hidden="true" />
    </span>
  )
}

/** Cover with a document sheet (folded corner, type icon, file format) rising from the bottom edge. */
export function ResourceCover({ type, fileType, className, children }: { type: string; fileType?: string | null; className?: string; children?: React.ReactNode }) {
  const { icon: Icon, cover } = styleFor(type)
  return (
    <div className={cn('relative overflow-hidden bg-gradient-to-br text-white', cover, className)}>
      <svg className="absolute inset-0 h-full w-full opacity-15" viewBox="0 0 400 160" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 110 C 70 90 130 130 210 108 S 340 90 400 106 V160 H0 Z" fill="white" />
      </svg>
      <Icon className="absolute -bottom-6 -left-5 size-28 opacity-10" aria-hidden="true" />
      <div className="absolute bottom-0 left-1/2 h-[68%] -translate-x-1/2 translate-y-[12%] drop-shadow-lg" aria-hidden="true">
        <div className="relative flex aspect-[3/4] h-full flex-col items-center justify-center gap-[6%] rounded-md bg-white text-slate-700 [clip-path:polygon(0_0,72%_0,100%_20%,100%_100%,0_100%)]">
          <span className="absolute left-[72%] top-0 h-[20%] w-[28%] bg-slate-300 [clip-path:polygon(0_0,0_100%,100%_100%)]" />
          <Icon className="size-[36%] opacity-80" />
          {fileType && <span className="max-w-[86%] truncate text-[0.62rem] font-bold uppercase tracking-wider text-slate-500">{fileType}</span>}
        </div>
      </div>
      <div className="relative h-full">{children}</div>
    </div>
  )
}
