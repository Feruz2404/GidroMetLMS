import type { LibraryResource, Prisma } from '@prisma/client'
import { audit } from '@/server/audit'
import { canManageResource, hasPermission, PERMISSIONS, requirePermission, type Actor } from '@/server/auth/permissions'
import { db } from '@/server/db'
import { badRequest, forbidden, found, notFound } from '@/server/http/errors'
import { ilike, pageMeta, skipTake } from '@/server/http/request'
import type { LibraryFacetsDto, LibraryResourceDto, ResourceType } from '@/shared/dto'
import type { ResourceInput, ResourceUpdateInput } from '@/shared/schemas'
import { safeResourceUrl } from '@/shared/url'

type ResourceSource = LibraryResource & { _count: { bookmarks: number }; bookmarks: Array<{ id: string }> }

function resourceInclude(userId: string) {
  return {
    _count: { select: { bookmarks: true } },
    bookmarks: { where: { userId }, select: { id: true } },
  } satisfies Prisma.LibraryResourceInclude
}

export function splitTags(tags: string | null): string[] {
  return tags ? tags.split(',').map((tag) => tag.trim()).filter(Boolean) : []
}

function toDto(resource: ResourceSource, actor: Actor): LibraryResourceDto {
  return {
    id: resource.id,
    slug: resource.slug,
    title: resource.title,
    description: resource.description,
    type: resource.type as ResourceType,
    category: resource.category,
    author: resource.author,
    publisher: resource.publisher,
    year: resource.year,
    language: resource.language,
    pages: resource.pages,
    fileUrl: safeResourceUrl(resource.fileUrl),
    fileType: resource.fileType,
    fileSize: resource.fileSize,
    coverUrl: safeResourceUrl(resource.coverUrl),
    tags: splitTags(resource.tags),
    downloadCount: resource.downloadCount,
    viewCount: resource.viewCount,
    bookmarkCount: resource._count.bookmarks,
    status: resource.status === 'archived' ? 'archived' : 'active',
    bookmarked: resource.bookmarks.length > 0,
    canManage: canManageResource(actor, resource),
    createdAt: resource.createdAt.toISOString(),
  }
}

function visibleWhere(actor: Actor): Prisma.LibraryResourceWhereInput {
  return hasPermission(actor.role, PERMISSIONS.LIBRARY_MANAGE) ? {} : { status: 'active' }
}

export interface LibraryListQuery {
  search?: string
  type?: string
  category?: string
  language?: string
  year?: number
  status?: 'active' | 'archived'
  bookmarked?: boolean
  sort: 'newest' | 'popular' | 'downloads' | 'title' | 'year'
  page: number
  limit: number
}

export async function listResources(actor: Actor, query: LibraryListQuery) {
  const and: Prisma.LibraryResourceWhereInput[] = [visibleWhere(actor), { status: query.status ?? 'active' }]
  if (query.search) {
    and.push({
      OR: [
        { title: ilike(query.search) },
        { author: ilike(query.search) },
        { description: ilike(query.search) },
        { tags: ilike(query.search) },
        { publisher: ilike(query.search) },
      ],
    })
  }
  if (query.type) and.push({ type: query.type })
  if (query.category) and.push({ category: query.category })
  if (query.language) and.push({ language: query.language })
  if (query.year) and.push({ year: query.year })
  if (query.bookmarked) and.push({ bookmarks: { some: { userId: actor.id } } })

  const orderBy: Prisma.LibraryResourceOrderByWithRelationInput[] = {
    newest: [{ createdAt: 'desc' as const }],
    popular: [{ viewCount: 'desc' as const }],
    downloads: [{ downloadCount: 'desc' as const }],
    title: [{ title: 'asc' as const }],
    year: [{ year: 'desc' as const }, { title: 'asc' as const }],
  }[query.sort]

  const where: Prisma.LibraryResourceWhereInput = { AND: and }
  const [total, resources] = await Promise.all([
    db.libraryResource.count({ where }),
    db.libraryResource.findMany({ where, orderBy, include: resourceInclude(actor.id), ...skipTake(query.page, query.limit) }),
  ])
  return { items: resources.map((resource) => toDto(resource, actor)), meta: pageMeta(total, query.page, query.limit) }
}

export async function getFacets(): Promise<LibraryFacetsDto> {
  const where = { status: 'active' }
  const [categories, types, languages, years] = await Promise.all([
    db.libraryResource.groupBy({ by: ['category'], where, _count: { _all: true }, orderBy: { category: 'asc' } }),
    db.libraryResource.groupBy({ by: ['type'], where, _count: { _all: true }, orderBy: { type: 'asc' } }),
    db.libraryResource.groupBy({ by: ['language'], where, _count: { _all: true }, orderBy: { language: 'asc' } }),
    db.libraryResource.groupBy({ by: ['year'], where, orderBy: { year: 'desc' } }),
  ])
  return {
    categories: categories.filter((row) => row.category).map((row) => ({ value: row.category!, count: row._count._all })),
    types: types.map((row) => ({ value: row.type as ResourceType, count: row._count._all })),
    languages: languages.map((row) => ({ value: row.language, count: row._count._all })),
    years: years.map((row) => row.year).filter((year): year is number => year !== null),
  }
}

export async function getResource(actor: Actor, id: string): Promise<LibraryResourceDto> {
  const resource = await db.libraryResource.findFirst({ where: { AND: [{ id }, visibleWhere(actor)] }, include: resourceInclude(actor.id) })
  if (!resource) throw notFound('Resource')
  // Count the view without blocking on it; analytics must not fail the page.
  await db.libraryResource.update({ where: { id }, data: { viewCount: { increment: 1 } } })
  return toDto({ ...resource, viewCount: resource.viewCount + 1 }, actor)
}

export async function getRelatedResources(actor: Actor, id: string): Promise<LibraryResourceDto[]> {
  const resource = found(await db.libraryResource.findUnique({ where: { id } }), 'Resource')
  const related = await db.libraryResource.findMany({
    where: { status: 'active', id: { not: id }, OR: [{ category: resource.category }, { type: resource.type }] },
    include: resourceInclude(actor.id),
    orderBy: [{ viewCount: 'desc' }],
    take: 4,
  })
  return related.map((item) => toDto(item, actor))
}

function normalizeInput<T extends Partial<ResourceInput>>(input: T) {
  const { tags, ...fields } = input
  const data: Record<string, unknown> = { ...fields }
  if (tags !== undefined) data.tags = tags.length ? tags.join(',') : null
  for (const key of ['fileUrl', 'coverUrl'] as const) {
    const value = input[key]
    if (value === undefined) continue
    const safe = value ? safeResourceUrl(value) : null
    if (value && !safe) throw badRequest('VALIDATION_FAILED', `${key} must be an https link`)
    data[key] = safe
  }
  return data
}

export async function createResource(actor: Actor, input: ResourceInput, req: Request) {
  requirePermission(actor, PERMISSIONS.LIBRARY_MANAGE)
  const resource = await db.libraryResource.create({
    data: { ...(normalizeInput(input) as Omit<Prisma.LibraryResourceUncheckedCreateInput, 'uploadedBy'>), uploadedBy: actor.id },
    include: resourceInclude(actor.id),
  })
  await audit({ userId: actor.id, action: 'create_resource', entity: 'library_resource', entityId: resource.id, request: req })
  return toDto(resource, actor)
}

async function findManagedResource(actor: Actor, id: string) {
  const resource = found(await db.libraryResource.findUnique({ where: { id } }), 'Resource')
  if (!canManageResource(actor, resource)) throw forbidden()
  return resource
}

export async function updateResource(actor: Actor, id: string, input: ResourceUpdateInput, req: Request) {
  await findManagedResource(actor, id)
  const updated = await db.libraryResource.update({ where: { id }, data: normalizeInput(input), include: resourceInclude(actor.id) })
  await audit({ userId: actor.id, action: 'update_resource', entity: 'library_resource', entityId: id, metadata: { fields: Object.keys(input) }, request: req })
  return toDto(updated, actor)
}

export async function archiveResource(actor: Actor, id: string, req: Request) {
  await findManagedResource(actor, id)
  await db.libraryResource.update({ where: { id }, data: { status: 'archived' } })
  await audit({ userId: actor.id, action: 'archive_resource', entity: 'library_resource', entityId: id, request: req })
}

export async function toggleBookmark(actor: Actor, id: string) {
  const resource = await db.libraryResource.findFirst({ where: { AND: [{ id }, visibleWhere(actor)] }, select: { id: true } })
  if (!resource) throw notFound('Resource')
  const existing = await db.resourceBookmark.findUnique({ where: { resourceId_userId: { resourceId: id, userId: actor.id } } })
  if (existing) {
    await db.resourceBookmark.delete({ where: { id: existing.id } })
    return { bookmarked: false }
  }
  await db.resourceBookmark.create({ data: { resourceId: id, userId: actor.id } })
  return { bookmarked: true }
}

/** Records a download and returns the vetted URL to open. */
export async function registerDownload(actor: Actor, id: string, req: Request) {
  const resource = await db.libraryResource.findFirst({ where: { AND: [{ id }, visibleWhere(actor)] } })
  if (!resource) throw notFound('Resource')
  const url = safeResourceUrl(resource.fileUrl)
  if (!url) throw notFound('File')
  const [, updated] = await db.$transaction([
    db.resourceDownload.create({ data: { resourceId: id, userId: actor.id } }),
    db.libraryResource.update({ where: { id }, data: { downloadCount: { increment: 1 } }, select: { downloadCount: true } }),
  ])
  await audit({ userId: actor.id, action: 'download_resource', entity: 'library_resource', entityId: id, request: req })
  return { url, downloadCount: updated.downloadCount }
}
