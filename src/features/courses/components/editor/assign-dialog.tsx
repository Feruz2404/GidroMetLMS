'use client'

import { useState } from 'react'
import { AlertTriangle, Building2, Loader2, UserCheck, X } from 'lucide-react'
import { toast } from 'sonner'
import { Field } from '@/components/shared/field'
import { FilterSelect } from '@/components/shared/filter-select'
import { SearchInput } from '@/components/shared/search-input'
import { UserAvatar } from '@/components/shared/user-avatar'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useI18n } from '@/i18n/provider'
import { useErrorToast } from '@/lib/use-api-error'
import { personName } from '@/lib/utils'
import type { CourseCardDto, LearnerCandidateDto } from '@/shared/dto'
import { useAssignableLearners, useAssignCourse, useDepartments, type AssignCourseInput } from '../../api'

type Mode = 'department' | 'learners'

function todayIso(): string {
  const now = new Date()
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 10)
}

function LearnerPicker({ courseId, selected, onToggle }: { courseId: string; selected: LearnerCandidateDto[]; onToggle: (user: LearnerCandidateDto) => void }) {
  const { t } = useI18n()
  const [search, setSearch] = useState('')
  const people = useAssignableLearners(courseId, search)
  const isSelected = (id: string) => selected.some((user) => user.id === id)

  return (
    <div className="space-y-3">
      {selected.length > 0 && (
        <ul className="flex flex-wrap gap-1.5" aria-label={t('courses.assign.selected', { count: selected.length })}>
          {selected.map((user) => (
            <li key={user.id}>
              <Badge variant="brand" className="gap-1 py-1 pl-2.5 pr-1">
                {personName(user)}
                <button
                  type="button"
                  onClick={() => onToggle(user)}
                  className="rounded-full p-0.5 hover:bg-primary/15"
                  aria-label={t('courses.assign.remove', { name: personName(user) })}
                >
                  <X className="size-3" aria-hidden="true" />
                </button>
              </Badge>
            </li>
          ))}
        </ul>
      )}
      <SearchInput value={search} onChange={setSearch} placeholder={t('courses.assign.searchLearners')} />
      <div className="max-h-64 overflow-y-auto rounded-lg border scrollbar-thin">
        {people.isPending ? (
          <div className="space-y-2 p-3" aria-busy="true">
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} className="h-9 w-full" />
            ))}
          </div>
        ) : people.isError ? (
          <p className="p-4 text-sm text-destructive">{t('state.error')}</p>
        ) : people.data.length === 0 ? (
          <p className="p-4 text-center text-sm text-muted-foreground">{t('state.noResults')}</p>
        ) : (
          <ul className="divide-y">
            {people.data.map((user) => (
              <li key={user.id}>
                <label className="flex cursor-pointer items-center gap-3 px-3 py-2.5 hover:bg-muted/50">
                  <Checkbox checked={isSelected(user.id)} onCheckedChange={() => onToggle(user)} />
                  <UserAvatar user={user} className="size-8" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{personName(user)}</span>
                    <span className="block truncate text-xs text-muted-foreground">{user.department ?? user.email}</span>
                  </span>
                  {user.enrolled && <Badge variant="muted">{t('courses.assign.alreadyEnrolled')}</Badge>}
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function AssignForm({ course, onDone }: { course: Pick<CourseCardDto, 'id' | 'title' | 'status'>; onDone: () => void }) {
  const { t } = useI18n()
  const onError = useErrorToast()
  const assign = useAssignCourse(course.id)
  const departments = useDepartments()
  const [mode, setMode] = useState<Mode>('department')
  const [department, setDepartment] = useState('')
  const [selected, setSelected] = useState<LearnerCandidateDto[]>([])
  const [deadline, setDeadline] = useState('')
  const [minDate] = useState(todayIso)
  const published = course.status === 'published'
  const ready = mode === 'department' ? Boolean(department) : selected.length > 0

  const toggle = (user: LearnerCandidateDto) =>
    setSelected((current) => (current.some((item) => item.id === user.id) ? current.filter((item) => item.id !== user.id) : [...current, user]))

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    const input: AssignCourseInput = mode === 'department' ? { department } : { userIds: selected.map((user) => user.id) }
    if (deadline) input.deadlineAt = deadline
    assign.mutate(input, {
      onSuccess: (result) => {
        if (result.matched === 0) toast.warning(t('courses.assign.noMatches'))
        else toast.success(t('courses.assign.success', { matched: result.matched, created: result.created }))
        onDone()
      },
      onError,
    })
  }

  return (
    <form onSubmit={submit} className="grid gap-5">
      <DialogHeader>
        <DialogTitle>{t('courses.assign.title')}</DialogTitle>
        <DialogDescription>{t('courses.assign.description', { title: course.title })}</DialogDescription>
      </DialogHeader>

      {!published && (
        <Alert className="border-warning/40 bg-warning/10">
          <AlertTriangle aria-hidden="true" />
          <AlertDescription className="text-foreground">{t('courses.assign.notPublished')}</AlertDescription>
        </Alert>
      )}

      <Tabs value={mode} onValueChange={(value) => setMode(value as Mode)}>
        <TabsList className="w-full">
          <TabsTrigger value="department">
            <Building2 aria-hidden="true" />
            {t('courses.assign.byDepartment')}
          </TabsTrigger>
          <TabsTrigger value="learners">
            <UserCheck aria-hidden="true" />
            {t('courses.assign.byLearners')}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {mode === 'department' ? (
        <Field id="assign-department" label={t('common.department')} hint={t('courses.assign.departmentHint')}>
          <FilterSelect
            value={department}
            onChange={setDepartment}
            ariaLabel={t('common.department')}
            placeholder={departments.isPending ? t('state.loading') : t('courses.assign.chooseDepartment')}
            options={(departments.data ?? []).map((item) => ({ value: item.name, label: item.name }))}
            className="h-9 sm:w-full"
          />
        </Field>
      ) : (
        <LearnerPicker courseId={course.id} selected={selected} onToggle={toggle} />
      )}

      <Field id="assign-deadline" label={t('courses.assign.deadline')} hint={t('courses.assign.deadlineHint')}>
        <Input id="assign-deadline" type="date" min={minDate} value={deadline} onChange={(event) => setDeadline(event.target.value)} className="sm:w-56" />
      </Field>

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline" disabled={assign.isPending}>
            {t('action.cancel')}
          </Button>
        </DialogClose>
        <Button type="submit" disabled={!published || !ready || assign.isPending}>
          {assign.isPending && <Loader2 className="animate-spin" aria-hidden="true" />}
          {mode === 'learners' && selected.length > 0 ? t('courses.assign.submitCount', { count: selected.length }) : t('courses.assign.submit')}
        </Button>
      </DialogFooter>
    </form>
  )
}

interface AssignDialogProps {
  course: Pick<CourseCardDto, 'id' | 'title' | 'status'>
  open: boolean
  onOpenChange: (open: boolean) => void
}

/** Assigns the course to a department or to hand-picked learners, with an optional deadline. */
export function AssignDialog({ course, open, onOpenChange }: AssignDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92dvh] overflow-y-auto scrollbar-thin sm:max-w-xl">
        <AssignForm course={course} onDone={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}
