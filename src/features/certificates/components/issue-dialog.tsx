'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Field } from '@/components/shared/field'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { useCourses } from '@/features/courses/api'
import { useI18n } from '@/i18n/provider'
import { routes } from '@/lib/routes'
import { useErrorMessage } from '@/lib/use-api-error'
import { personName } from '@/lib/utils'
import { useCourseLearners, useIssueCertificate } from '../api'

export function IssueCertificateDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { t } = useI18n()
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t('certificates.issue.title')}</DialogTitle>
          <DialogDescription>{t('certificates.issue.description')}</DialogDescription>
        </DialogHeader>
        <IssueForm onDone={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}

function IssueForm({ onDone }: { onDone: () => void }) {
  const { t, formatDate } = useI18n()
  const router = useRouter()
  const errorMessage = useErrorMessage()
  const [courseId, setCourseId] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const courses = useCourses({ view: 'managed', sort: 'title', limit: 100 })
  const learners = useCourseLearners(courseId)
  const issue = useIssueCertificate()

  // Only learners who finished the course and hold no active certificate are candidates.
  const eligible = (learners.data ?? []).filter((learner) => learner.status === 'completed' && !learner.certificateId)

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!courseId || !userId) return
    issue.mutate(
      { courseId, userId },
      {
        onSuccess: (certificate) => {
          toast.success(t('certificates.issue.done', { number: certificate.certNumber }), {
            action: { label: t('action.view'), onClick: () => router.push(routes.certificate(certificate.id)) },
          })
          onDone()
        },
      }
    )
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <Field id="issue-course" label={t('certificates.issue.course')} required>
        {courses.isPending ? (
          <Skeleton className="h-9 w-full" />
        ) : (
          <Select
            value={courseId ?? undefined}
            onValueChange={(value) => {
              setCourseId(value)
              setUserId(null)
              issue.reset()
            }}
          >
            <SelectTrigger id="issue-course" className="w-full">
              <SelectValue placeholder={t('certificates.issue.coursePlaceholder')} />
            </SelectTrigger>
            <SelectContent className="max-h-72">
              {courses.data?.items.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {courses.data?.items.length === 0 && <p className="text-xs text-muted-foreground">{t('certificates.issue.noCourses')}</p>}
      </Field>

      {courseId && (
        <Field id="issue-learner" label={t('certificates.issue.learner')} required>
          {learners.isPending ? (
            <Skeleton className="h-9 w-full" />
          ) : learners.isError ? (
            <p className="text-sm text-destructive">{errorMessage(learners.error)}</p>
          ) : eligible.length === 0 ? (
            <p className="rounded-lg border border-dashed bg-muted/40 px-3 py-3 text-sm text-muted-foreground">{t('certificates.issue.noEligible')}</p>
          ) : (
            <Select
              value={userId ?? undefined}
              onValueChange={(value) => {
                setUserId(value)
                issue.reset()
              }}
            >
              <SelectTrigger id="issue-learner" className="w-full">
                <SelectValue placeholder={t('certificates.issue.learnerPlaceholder')} />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                {eligible.map((learner) => (
                  <SelectItem key={learner.user.id} value={learner.user.id}>
                    <span className="truncate">{personName(learner.user)}</span>
                    <span className="text-xs text-muted-foreground">
                      {learner.completedAt && t('certificates.issue.completedOn', { date: formatDate(learner.completedAt, 'short') })}
                      {learner.bestPercentage !== null && ` · ${Math.round(learner.bestPercentage)}%`}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </Field>
      )}

      {issue.isError && (
        <Alert variant="destructive">
          <AlertCircle aria-hidden="true" />
          <AlertDescription>{errorMessage(issue.error)}</AlertDescription>
        </Alert>
      )}

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onDone} disabled={issue.isPending}>
          {t('action.cancel')}
        </Button>
        <Button type="submit" disabled={!courseId || !userId || issue.isPending}>
          {issue.isPending && <Loader2 className="animate-spin" aria-hidden="true" />}
          {t('certificates.issue.submit')}
        </Button>
      </DialogFooter>
    </form>
  )
}
