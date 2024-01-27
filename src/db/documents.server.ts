import { db } from "./db.server"
import { DocumentRow } from "./types"

export async function getLatestDocumentBySlug(
  collection: string,
  slug: string
): Promise<DocumentRow | undefined> {
  const row = await db.get<DocumentRow>(
    `
    select *
    from documents
    where collection = ?
    and slug = ?
    order by version desc
    limit 1
  `,
    collection,
    slug
  )
  return row
}

export async function getLatestDocumentByID(
  collection: string,
  id: string
): Promise<DocumentRow | undefined> {
  const row = await db.get<DocumentRow>(
    `
    select *
    from documents
    where collection = ?
    and id = ?
    order by version desc
    limit 1
  `,
    collection,
    id
  )
  return row
}

export async function getLatestPublishedDocumentBySlug(
  collection: string,
  slug: string
): Promise<DocumentRow | undefined> {
  const row = await db.get(
    `
    select *
    from documents
    where collection = ?
    and slug = ?
    and published = true
    order by version desc
    limit 1
  `,
    collection,
    slug
  )
  return row
}

export async function listLatestDocumentsForCollection(
  collection: string,
  options?: { requirePublished?: boolean }
): Promise<DocumentRow[] | undefined> {
  const rows = await db.all(
    `
      SELECT *
      from documents
      where collection = ?
      ${options?.requirePublished ? "and published = true" : ""}
      order by version desc limit 1
      `,
    collection
  )
  return rows
}

export async function insertDocumentVersion(doc: DocumentRow) {
  await db.run(
    `
    insert into documents (
      collection,
      id,
      version,
      published,
      slug,
      name,
      description,
      banner_path,
      created_ms,
      originally_created_ms
    ) values (
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?
    )
  `,
    doc.collection,
    doc.id,
    doc.version,
    doc.published,
    doc.slug,
    doc.name,
    doc.description ?? null,
    doc.banner_path ?? null,
    doc.created_ms,
    doc.originally_created_ms
  )
}

export async function setDocumentPublishStatus(
  collection: string,
  id: string,
  published: boolean
) {
  await db.run(
    `
    update documents
    set published = ?
    where collection = ?
    and id = ?
  `,
    published,
    collection,
    id
  )
}
