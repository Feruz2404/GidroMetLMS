import type { Prisma } from '@prisma/client'
import { db, type Tx } from '@/server/db'
import { getClientIp, getUserAgent } from '@/server/http/request'
import { logServerError } from '@/server/log'

export interface AuditEntry {
  userId: string
  action: string
  entity?: string
  entityId?: string
  metadata?: Record<string, unknown>
  request?: Request
}

/**
 * Records an audit-log entry. Auditing must never break the user's action, so
 * failures are logged and swallowed.
 */
export async function audit(entry: AuditEntry, client: Tx | typeof db = db): Promise<void> {
  const data: Prisma.ActivityLogUncheckedCreateInput = {
    userId: entry.userId,
    action: entry.action,
    entity: entry.entity,
    entityId: entry.entityId,
    metadata: entry.metadata ? JSON.stringify(entry.metadata) : null,
    ipAddress: entry.request ? getClientIp(entry.request) : undefined,
    userAgent: entry.request ? getUserAgent(entry.request) : undefined,
  }
  try {
    await client.activityLog.create({ data })
  } catch (error) {
    logServerError('audit.write', error, { action: entry.action })
  }
}
