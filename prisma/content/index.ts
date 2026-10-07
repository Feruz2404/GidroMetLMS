// Ordered catalogue: index N is persisted with the stable id production-course-(N+1).
// Keep the order; append new courses at the end so existing ids never shift.
import type { CourseContent } from './types'
import { course as course01 } from './courses/01-gidrometeorologiyaga-kirish'
import { course as course02 } from './courses/02-meteorologik-kuzatuvlarni-tashkil-etish'
import { course as course03 } from './courses/03-sinoptik-xaritalarni-tahlil-qilish'
import { course as course04 } from './courses/04-qisqa-muddatli-ob-havo-prognozi'
import { course as course05 } from './courses/05-xavfli-ob-havo-hodisalarini-prognozlash'
import { course as course06 } from './courses/06-agrometeorologik-kuzatuvlar'
import { course as course07 } from './courses/07-daryo-gidrologiyasi-asoslari'
import { course as course08 } from './courses/08-gidrologik-postlarda-kuzatuv-olib-borish'
import { course as course09 } from './courses/09-suv-sarfini-hisoblash-usullari'
import { course as course10 } from './courses/10-toshqin-va-sel-xavfini-baholash'
import { course as course11 } from './courses/11-iqlim-malumotlarini-statistik-tahlil-qilish'
import { course as course12 } from './courses/12-iqlim-ozgarishi-va-moslashuv'
import { course as course13 } from './courses/13-suniy-yoldosh-tasvirlarini-tahlil-qilish'
import { course as course14 } from './courses/14-meteorologik-radar-malumotlaridan-foydalanish'
import { course as course15 } from './courses/15-atmosfera-havosi-sifati-monitoringi'
import { course as course16 } from './courses/16-meteorologik-asbob-uskunalar-bilan-ishlash'
import { course as course17 } from './courses/17-gidrometeorologik-malumotlar-sifatini-nazorat-qilish'
import { course as course18 } from './courses/18-mehnat-muhofazasi-va-texnika-xavfsizligi'

export const COURSES: CourseContent[] = [
  course01,
  course02,
  course03,
  course04,
  course05,
  course06,
  course07,
  course08,
  course09,
  course10,
  course11,
  course12,
  course13,
  course14,
  course15,
  course16,
  course17,
  course18,
]

export { libraryResources as LIBRARY_RESOURCES } from './library'
export { ANNOUNCEMENTS, CATEGORIES, DEPARTMENTS, REGIONAL_DIVISIONS, ROLE_DEFINITIONS } from './organization'
export type * from './types'
