'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { PageHeader } from '@/components/shared/page-header'
import { useI18n } from '@/i18n/provider'
import { routes } from '@/lib/routes'
import { useCreateCourse } from './api'
import { CourseDetailsForm } from './components/editor/course-details-form'

export function CourseCreatePage() {
  const { t } = useI18n()
  const router = useRouter()
  const create = useCreateCourse()

  return (
    <div>
      <PageHeader
        back={{ href: routes.courses, label: t('courses.catalog.title') }}
        eyebrow={t('courses.editor.eyebrow')}
        title={t('courses.create.title')}
        description={t('courses.create.description')}
      />
      <CourseDetailsForm
        submitLabel={t('courses.create.submit')}
        pending={create.isPending}
        onSubmit={async (input) => {
          const course = await create.mutateAsync(input)
          toast.success(t('courses.create.success'))
          router.push(`${routes.courseEditor(course.id)}?tab=curriculum`)
        }}
      />
    </div>
  )
}
