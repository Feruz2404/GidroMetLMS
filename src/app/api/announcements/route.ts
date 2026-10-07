import { authedRoute } from '@/server/http/handler'
import { parseBody } from '@/server/http/request'
import { ok } from '@/server/http/response'
import { publishAnnouncement } from '@/server/modules/notifications/service'
import { announcementSchema } from '@/shared/schemas'

// POST /api/announcements — broadcast an announcement as notifications.
export const POST = authedRoute(async (req, { user }) => ok(await publishAnnouncement(user, await parseBody(req, announcementSchema), req)))
