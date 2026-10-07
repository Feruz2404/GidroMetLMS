'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Award, ClipboardCheck, GraduationCap, Loader2, Pencil, PlayCircle, RotateCcw, UserPlus, Users } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useSession } from '@/features/auth/session'
import { useI18n } from '@/i18n/provider'
import { routes } from '@/lib/routes'
import { useErrorToast } from '@/lib/use-api-error'
import type { CourseDetailDto } from '@/shared/dto'
import { useEnroll } from '../api'
import { AssignDialog } from './editor/assign-dialog'
import { activeEnrollment, pendingQuiz } from './lesson-meta'

export function EnrollButton({ courseId, size = 'lg' }: { courseId: string; size?: 'default' | 'lg' }) {
  const { t } = useI18n()
  const enroll = useEnroll()
  const onError = useErrorToast()
  return (
    <Button
      size={size}
      disabled={enroll.isPending}
      onClick={() => enroll.mutate(courseId, { onSuccess: () => toast.success(t('courses.enroll.success')), onError })}
    >
      {enroll.isPending ? <Loader2 className="animate-spin" aria-hidden="true" /> : <GraduationCap aria-hidden="true" />}
      {t('courses.actions.enroll')}
    </Button>
  )
}

/** The primary call to action for the viewer: manage, enroll, continue or collect the certificate. */
export function CourseActions({ course }: { course: CourseDetailDto }) {
  const { t } = useI18n()
  const session = useSession()
  const [assignOpen, setAssignOpen] = useState(false)
  const enrollment = activeEnrollment(course)

  if (course.canManage) {
    return (
      <div className="flex flex-wrap gap-2">
        <Button asChild>
          <Link href={routes.courseEditor(course.id)}>
            <Pencil aria-hidden="true" />
            {t('courses.actions.edit')}
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href={`${routes.courseEditor(course.id)}?tab=learners`}>
            <Users aria-hidden="true" />
            {t('courses.actions.learners')}
          </Link>
        </Button>
        <Button variant="outline" onClick={() => setAssignOpen(true)}>
          <UserPlus aria-hidden="true" />
          {t('courses.actions.assign')}
        </Button>
        <AssignDialog course={course} open={assignOpen} onOpenChange={setAssignOpen} />
      </div>
    )
  }

  if (!session.isLearner) return null
  if (!enrollment) return <EnrollButton courseId={course.id} />

  if (enrollment.status === 'completed') {
    const quiz = pendingQuiz(course)
    return (
      <div className="flex flex-wrap gap-2">
        {course.certificate ? (
          <Button asChild size="lg">
            <Link href={routes.certificate(course.certificate.id)}>
              <Award aria-hidden="true" />
              {t('courses.actions.certificate')}
            </Link>
          </Button>
        ) : (
          quiz && (
            <Button asChild size="lg">
              <Link href={routes.quiz(quiz.id)}>
                <ClipboardCheck aria-hidden="true" />
                {t('courses.actions.finalTest')}
              </Link>
            </Button>
          )
        )}
        {course.nextLessonId && (
          <Button asChild size="lg" variant="outline">
            <Link href={routes.lesson(course.id, course.nextLessonId)}>
              <RotateCcw aria-hidden="true" />
              {t('courses.actions.review')}
            </Link>
          </Button>
        )}
      </div>
    )
  }

  if (!course.nextLessonId) return null
  return (
    <Button asChild size="lg">
      <Link href={routes.lesson(course.id, course.nextLessonId)}>
        <PlayCircle aria-hidden="true" />
        {course.completedLessons > 0 ? t('courses.card.continue') : t('courses.card.start')}
      </Link>
    </Button>
  )
}
