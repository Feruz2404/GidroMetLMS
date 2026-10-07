import type { Notification, Prisma } from '@prisma/client'
import { audit } from '@/server/audit'
import { requirePermission, type Actor } from '@/server/auth/permissions'
import { db, type Tx } from '@/server/db'
import { notFound } from '@/server/http/errors'
import type { NotificationDto, NotificationListDto, NotificationType } from '@/shared/dto'
import { LEARNER_ROLES, PERMISSIONS } from '@/shared/roles'
import type { AnnouncementInput } from '@/shared/schemas'

export interface NotificationInput {
  type: NotificationType
  title: string
  message: string
  link?: string | null
  /** Makes the notification idempotent per user (see the unique index). */
  eventKey?: string
}

function toDto(notification: Notification): NotificationDto {
  return {
    id: notification.id,
    type: (['info', 'success', 'warning', 'error'].includes(notification.type) ? notification.type : 'info') as NotificationType,
    title: notification.title,
    message: notification.message,
    link: notification.link,
    isRead: notification.isRead,
    createdAt: notification.createdAt.toISOString(),
  }
}

export async function notify(userId: string, input: NotificationInput, client: Tx | typeof db = db): Promise<void> {
  const data = { type: input.type, title: input.title, message: input.message, link: input.link ?? null }
  if (input.eventKey) {
    await client.notification.upsert({
      where: { userId_eventKey: { userId, eventKey: input.eventKey } },
      update: {},
      create: { userId, eventKey: input.eventKey, ...data },
    })
    return
  }
  await client.notification.create({ data: { userId, ...data } })
}

export async function listNotifications(
  userId: string,
  options: { unreadOnly: boolean; limit: number }
): Promise<NotificationListDto> {
  const where: Prisma.NotificationWhereInput = { userId, ...(options.unreadOnly ? { isRead: false } : {}) }
  const [items, unreadCount] = await Promise.all([
    db.notification.findMany({ where, orderBy: { createdAt: 'desc' }, take: options.limit }),
    db.notification.count({ where: { userId, isRead: false } }),
  ])
  return { items: items.map(toDto), unreadCount }
}

async function findOwned(userId: string, id: string) {
  const notification = await db.notification.findUnique({ where: { id } })
  if (!notification || notification.userId !== userId) throw notFound('Notification')
  return notification
}

export async function markRead(userId: string, id: string): Promise<NotificationDto> {
  await findOwned(userId, id)
  return toDto(await db.notification.update({ where: { id }, data: { isRead: true } }))
}

export async function markAllRead(userId: string): Promise<{ updated: number }> {
  const result = await db.notification.updateMany({ where: { userId, isRead: false }, data: { isRead: true } })
  return { updated: result.count }
}

export async function removeNotification(userId: string, id: string): Promise<void> {
  await findOwned(userId, id)
  await db.notification.delete({ where: { id } })
}

/** Broadcasts an announcement to the selected audience as notifications. */
export async function publishAnnouncement(actor: Actor, input: AnnouncementInput, req: Request) {
  requirePermission(actor, PERMISSIONS.ANNOUNCEMENTS_MANAGE)
  const roleFilter: Prisma.UserWhereInput =
    input.audience === 'learners'
      ? { role: { in: [...LEARNER_ROLES] } }
      : input.audience === 'staff'
        ? { role: { notIn: [...LEARNER_ROLES] } }
        : {}
  const recipients = await db.user.findMany({ where: { isActive: true, ...roleFilter }, select: { id: true } })
  const eventKey = `announcement-${Date.now().toString(36)}`

  await db.$transaction(async (tx) => {
    await tx.announcement.create({
      data: {
        id: eventKey,
        eventKey,
        titleUz: input.title,
        messageUz: input.message,
        type: input.type,
        link: input.link,
      },
    })
    await tx.notification.createMany({
      data: recipients.map((recipient) => ({
        userId: recipient.id,
        eventKey,
        type: input.type,
        title: input.title,
        message: input.message,
        link: input.link,
      })),
      skipDuplicates: true,
    })
  })
  await audit({ userId: actor.id, action: 'publish_announcement', entity: 'announcement', entityId: eventKey, metadata: { recipients: recipients.length }, request: req })
  return { recipients: recipients.length }
}
