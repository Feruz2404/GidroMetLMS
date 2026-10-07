import type { Metadata } from 'next'
import { CourseCatalogPage } from '@/features/courses/catalog-page'

export const metadata: Metadata = { title: 'Kurslar' }

export default function Page() {
  return <CourseCatalogPage />
}
