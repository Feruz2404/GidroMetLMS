// Pure learning-progress rules (no I/O) so they can be unit tested.

interface Orderable {
  id: string
  order: number
}

interface OrderableLesson extends Orderable {
  sectionId: string | null
}

/** Lessons in reading order: by section order first, then by lesson order; unsectioned lessons last. */
export function orderLessons<L extends OrderableLesson>(sections: Orderable[], lessons: L[]): L[] {
  const sectionRank = new Map([...sections].sort((a, b) => a.order - b.order).map((section, index) => [section.id, index]))
  const rank = (lesson: L) => (lesson.sectionId !== null && sectionRank.has(lesson.sectionId) ? sectionRank.get(lesson.sectionId)! : Number.MAX_SAFE_INTEGER)
  return [...lessons].sort((a, b) => rank(a) - rank(b) || a.order - b.order)
}

/** A video lesson counts as watched after 80 % of its stated duration (at least 30 s). */
export function requiredWatchSeconds(lesson: { type: string; durationMin: number }): number {
  if (lesson.type !== 'video') return 0
  return Math.max(30, Math.floor(lesson.durationMin * 60 * 0.8))
}

export function progressPercent(completed: number, total: number): number {
  if (total <= 0) return 0
  return Math.min(100, Math.round((completed / total) * 100))
}
