import { z } from 'zod'
import { authedRoute } from '@/server/http/handler'
import { parseBody } from '@/server/http/request'
import { ok } from '@/server/http/response'
import { recordProgress } from '@/server/modules/courses/curriculum'
import { lessonProgressSchema } from '@/shared/schemas'

const body = lessonProgressSchema.extend({ lessonId: z.string().min(1) })

// POST /api/courses/[id]/progress — record watch time and/or lesson completion.
export const POST = authedRoute<{ id: string }>(async (req, { user }) => {
  const { lessonId, ...progress } = await parseBody(req, body)
  return ok(await recordProgress(user, lessonId, progress, req))
})
