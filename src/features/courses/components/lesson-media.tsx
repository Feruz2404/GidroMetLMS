'use client'

import { Download, ExternalLink, FileText, VideoOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/i18n/provider'
import { safeResourceUrl, youtubeVideoId } from '@/shared/url'

export type VideoSource = { kind: 'youtube'; id: string } | { kind: 'file'; url: string }

export function videoSource(url: string | null): VideoSource | null {
  const id = youtubeVideoId(url)
  if (id) return { kind: 'youtube', id }
  const safe = safeResourceUrl(url)
  return safe ? { kind: 'file', url: safe } : null
}

interface LessonVideoProps {
  source: VideoSource | null
  title: string
  onPlayingChange: (playing: boolean) => void
}

export function LessonVideo({ source, title, onPlayingChange }: LessonVideoProps) {
  const { t } = useI18n()
  if (!source) {
    return (
      <div className="flex aspect-video flex-col items-center justify-center gap-3 rounded-xl border border-dashed bg-muted/40 p-6 text-center">
        <VideoOff className="size-8 text-muted-foreground" aria-hidden="true" />
        <p className="text-sm text-muted-foreground">{t('courses.lesson.videoUnavailable')}</p>
      </div>
    )
  }
  return (
    <div className="overflow-hidden rounded-xl bg-black shadow-[var(--shadow-elevated)]">
      {source.kind === 'youtube' ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${source.id}?rel=0&modestbranding=1`}
          title={title}
          className="aspect-video w-full"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <video
          src={source.url}
          controls
          controlsList="nodownload"
          preload="metadata"
          className="aspect-video w-full"
          aria-label={title}
          onPlay={() => onPlayingChange(true)}
          onPause={() => onPlayingChange(false)}
          onEnded={() => onPlayingChange(false)}
        />
      )}
    </div>
  )
}

export function LessonDocument({ url }: { url: string | null }) {
  const { t } = useI18n()
  const safe = safeResourceUrl(url)
  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-card p-5 shadow-[var(--shadow-card)] sm:flex-row sm:items-center">
      <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <FileText className="size-6" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-semibold">{t('courses.lesson.document')}</p>
        <p className="text-sm text-muted-foreground">{safe ? t('courses.lesson.documentHint') : t('courses.lesson.documentMissing')}</p>
      </div>
      {safe && (
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <a href={safe} target="_blank" rel="noopener noreferrer">
              <ExternalLink aria-hidden="true" />
              {t('action.open')}
            </a>
          </Button>
          <Button asChild>
            <a href={safe} download>
              <Download aria-hidden="true" />
              {t('action.download')}
            </a>
          </Button>
        </div>
      )}
    </div>
  )
}
