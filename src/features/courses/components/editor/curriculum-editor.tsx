'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowDown, ArrowUp, Eye, Layers, MoreHorizontal, Pencil, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { EmptyState } from '@/components/shared/empty-state'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useI18n } from '@/i18n/provider'
import { ApiError } from '@/lib/api-client'
import { routes } from '@/lib/routes'
import { useErrorToast } from '@/lib/use-api-error'
import type { CourseDetailDto, LessonOutlineDto, SectionDto } from '@/shared/dto'
import { useDeleteLesson, useDeleteSection, useReorderLessons, useReorderSections } from '../../api'
import { flattenLessons, formatMinutes, LESSON_TYPE_ICONS, sectionTitle, totalMinutes } from '../lesson-meta'
import { LessonDialog, type LessonDialogState } from './lesson-dialog'
import { SectionDialog, type SectionDialogState } from './section-dialog'

type PendingDelete = { kind: 'section'; section: SectionDto } | { kind: 'lesson'; lesson: LessonOutlineDto }

function move<T>(items: T[], index: number, offset: -1 | 1): T[] {
  const next = [...items]
  const [item] = next.splice(index, 1)
  next.splice(index + offset, 0, item)
  return next
}

function MoveButtons({ label, index, count, disabled, onMove }: { label: string; index: number; count: number; disabled: boolean; onMove: (offset: -1 | 1) => void }) {
  const { t } = useI18n()
  return (
    <div className="flex items-center">
      <Button type="button" variant="ghost" size="icon-sm" disabled={disabled || index === 0} onClick={() => onMove(-1)} aria-label={t('courses.editor.moveUp', { name: label })}>
        <ArrowUp aria-hidden="true" />
      </Button>
      <Button type="button" variant="ghost" size="icon-sm" disabled={disabled || index === count - 1} onClick={() => onMove(1)} aria-label={t('courses.editor.moveDown', { name: label })}>
        <ArrowDown aria-hidden="true" />
      </Button>
    </div>
  )
}

interface LessonRowProps {
  courseId: string
  lesson: LessonOutlineDto
  index: number
  count: number
  reorderable: boolean
  busy: boolean
  onMove: (offset: -1 | 1) => void
  onEdit: () => void
  onDelete: () => void
}

function LessonRow({ courseId, lesson, index, count, reorderable, busy, onMove, onEdit, onDelete }: LessonRowProps) {
  const { t } = useI18n()
  const Icon = LESSON_TYPE_ICONS[lesson.type]
  return (
    <li className="flex items-center gap-3 px-4 py-2.5 sm:px-5">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <button type="button" onClick={onEdit} className="block max-w-full truncate text-left text-sm font-medium hover:text-primary focus-visible:underline focus-visible:outline-none">
          {lesson.title}
        </button>
        <p className="text-xs text-muted-foreground">
          {t(`courses.lessonType.${lesson.type}`)} · {formatMinutes(t, lesson.durationMin)}
        </p>
      </div>
      {lesson.isFree && (
        <Badge variant="info" className="hidden sm:inline-flex">
          {t('courses.curriculum.preview')}
        </Badge>
      )}
      {reorderable && <MoveButtons label={lesson.title} index={index} count={count} disabled={busy} onMove={onMove} />}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" variant="ghost" size="icon-sm" aria-label={t('courses.editor.lessonActions', { name: lesson.title })}>
            <MoreHorizontal aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={onEdit}>
            <Pencil aria-hidden="true" />
            {t('action.edit')}
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={routes.lesson(courseId, lesson.id)}>
              <Eye aria-hidden="true" />
              {t('courses.editor.previewLesson')}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onSelect={onDelete}>
            <Trash2 aria-hidden="true" />
            {t('action.delete')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </li>
  )
}

export function CurriculumEditor({ course }: { course: CourseDetailDto }) {
  const { t } = useI18n()
  const onError = useErrorToast()
  const reorderSections = useReorderSections(course.id)
  const reorderLessons = useReorderLessons(course.id)
  const deleteSection = useDeleteSection(course.id)
  const deleteLesson = useDeleteLesson(course.id)
  const [sectionDialog, setSectionDialog] = useState<SectionDialogState>({ open: false, section: null })
  const [lessonDialog, setLessonDialog] = useState<LessonDialogState>({ open: false, sectionId: '' })
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const sections = course.sections.filter((section) => section.id !== 'unsectioned')
  const lessons = flattenLessons(course)
  const busy = reorderSections.isPending || reorderLessons.isPending

  const moveSection = (index: number, offset: -1 | 1) =>
    reorderSections.mutate(
      move(sections, index, offset).map((section) => section.id),
      { onError }
    )
  const moveLesson = (section: SectionDto, index: number, offset: -1 | 1) =>
    reorderLessons.mutate({ sectionId: section.id, ids: move(section.lessons, index, offset).map((lesson) => lesson.id) }, { onError })

  const requestDelete = (target: PendingDelete) => {
    setPendingDelete(target)
    setDeleteOpen(true)
  }

  const confirmDelete = async () => {
    if (!pendingDelete) return
    try {
      if (pendingDelete.kind === 'section') await deleteSection.mutateAsync(pendingDelete.section.id)
      else await deleteLesson.mutateAsync(pendingDelete.lesson.id)
      toast.success(pendingDelete.kind === 'section' ? t('courses.editor.section.deleted') : t('courses.editor.lesson.deleted'))
    } catch (error) {
      // A published course keeps its sections until their lessons are moved or removed.
      if (pendingDelete.kind === 'section' && error instanceof ApiError && error.code === 'CONFLICT') toast.error(t('courses.editor.section.deleteConflict'))
      else onError(error)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {t('courses.curriculum.summary', { sections: sections.length, lessons: lessons.length, duration: formatMinutes(t, totalMinutes(lessons)) })}
        </p>
        <Button onClick={() => setSectionDialog({ open: true, section: null })}>
          <Plus aria-hidden="true" />
          {t('courses.editor.section.add')}
        </Button>
      </div>

      {course.sections.length === 0 ? (
        <EmptyState
          icon={Layers}
          title={t('courses.editor.curriculumEmpty')}
          description={t('courses.editor.curriculumEmptyHint')}
          action={
            <Button onClick={() => setSectionDialog({ open: true, section: null })}>
              <Plus aria-hidden="true" />
              {t('courses.editor.section.add')}
            </Button>
          }
        />
      ) : (
        course.sections.map((section) => {
          const sectionIndex = sections.findIndex((item) => item.id === section.id)
          const real = sectionIndex >= 0
          return (
            <section key={section.id} className="overflow-hidden rounded-xl border bg-card shadow-[var(--shadow-card)]" aria-labelledby={`section-${section.id}`}>
              <header className="flex items-start gap-3 border-b bg-muted/20 px-4 py-3 sm:px-5">
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold tabular-nums text-primary">
                  {real ? sectionIndex + 1 : '·'}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 id={`section-${section.id}`} className="font-semibold leading-snug">
                    {sectionTitle(t, section)}
                  </h3>
                  {section.description && <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">{section.description}</p>}
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {t('common.lessons', { count: section.lessons.length })} · {formatMinutes(t, totalMinutes(section.lessons))}
                  </p>
                </div>
                {real && (
                  <div className="flex shrink-0 items-center">
                    <MoveButtons label={section.title} index={sectionIndex} count={sections.length} disabled={busy} onMove={(offset) => moveSection(sectionIndex, offset)} />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button type="button" variant="ghost" size="icon-sm" aria-label={t('courses.editor.sectionActions', { name: section.title })}>
                          <MoreHorizontal aria-hidden="true" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => setSectionDialog({ open: true, section })}>
                          <Pencil aria-hidden="true" />
                          {t('courses.editor.section.rename')}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive" onSelect={() => requestDelete({ kind: 'section', section })}>
                          <Trash2 aria-hidden="true" />
                          {t('action.delete')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </header>

              {section.lessons.length > 0 ? (
                <ol className="divide-y">
                  {section.lessons.map((lesson, index) => (
                    <LessonRow
                      key={lesson.id}
                      courseId={course.id}
                      lesson={lesson}
                      index={index}
                      count={section.lessons.length}
                      reorderable={real}
                      busy={busy}
                      onMove={(offset) => moveLesson(section, index, offset)}
                      onEdit={() => setLessonDialog({ open: true, sectionId: lesson.sectionId ?? sections[0]?.id ?? '', lessonId: lesson.id })}
                      onDelete={() => requestDelete({ kind: 'lesson', lesson })}
                    />
                  ))}
                </ol>
              ) : (
                <p className="px-5 py-4 text-sm text-muted-foreground">{t('courses.editor.sectionEmpty')}</p>
              )}

              {real && (
                <div className="border-t px-3 py-2 sm:px-4">
                  <Button type="button" variant="ghost" size="sm" className="text-primary hover:text-primary" onClick={() => setLessonDialog({ open: true, sectionId: section.id })}>
                    <Plus aria-hidden="true" />
                    {t('courses.editor.lesson.add')}
                  </Button>
                </div>
              )}
            </section>
          )
        })
      )}

      <SectionDialog courseId={course.id} state={sectionDialog} onClose={() => setSectionDialog((current) => ({ ...current, open: false }))} />
      <LessonDialog courseId={course.id} sections={sections} state={lessonDialog} onClose={() => setLessonDialog((current) => ({ ...current, open: false }))} />
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        destructive
        title={pendingDelete?.kind === 'section' ? t('courses.editor.section.deleteTitle') : t('courses.editor.lesson.deleteTitle')}
        description={
          pendingDelete?.kind === 'section'
            ? t('courses.editor.section.deleteDescription', { name: pendingDelete.section.title, count: pendingDelete.section.lessons.length })
            : pendingDelete
              ? t('courses.editor.lesson.deleteDescription', { name: pendingDelete.lesson.title })
              : undefined
        }
        confirmLabel={t('action.delete')}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
