import { db } from "./db.server"
import { DocumentListItem, DocumentRow } from "./types"

export async function getLatestDocumentBySlug(
  collection: string,
  slug: string
): Promise<DocumentRow | undefined> {
  const row = (await db
    .query(
      `
    select *
    from documents
    where collection = ?
    and slug = ?
    order by version desc
    limit 1
  `
    )
    .get(collection, slug)) as DocumentRow | undefined
  return row
}

export async function getLatestPublishedDocumentBySlug(
  collection: string,
  slug: string
): Promise<DocumentRow | undefined> {
  const row = (await db
    .query(
      `
    select *
    from documents
    where collection = ?
    and slug = ?
    and published = true
    order by version desc
    limit 1
  `
    )
    .get(collection, slug)) as DocumentRow | undefined
  return row
}

export async function listLatestDocumentsForCollection(
  collection: string,
  options?: { requirePublished?: boolean }
): Promise<DocumentListItem[] | undefined> {
  const rows = (await db
    .query(
      `
      SELECT d.*, originally_created.min_created as originally_created
      FROM documents d
      JOIN (
        SELECT collection, id, MAX(version) AS latest_version
        FROM documents
        WHERE collection = ?
        ${options?.requirePublished ? "AND published = true" : ""}
        GROUP BY collection, id
      ) latest_docs ON d.collection = latest_docs.collection AND d.id = latest_docs.id AND d.version = latest_docs.latest_version
      JOIN (
        SELECT collection, id, MIN(created) AS min_created
        FROM documents
        WHERE collection = ?
        GROUP BY collection, id
      ) originally_created ON d.collection = originally_created.collection AND d.id = originally_created.id
      `
    )
    .all(collection, collection)) as DocumentListItem[] | undefined
  return rows
}

export async function insertDocumentVersion(doc: DocumentRow) {
  await db
    .query(
      `
    insert into documents (
      collection,
      id,
      version,
      published,
      slug,
      name,
      description,
      banner_path
    ) values (
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?
    )
  `
    )
    .run(
      doc.collection,
      doc.id,
      doc.version,
      doc.published,
      doc.slug,
      doc.name,
      doc.description ?? null,
      doc.banner_path ?? null
    )
}

export async function setDocumentPublishStatus(
  collection: string,
  id: string,
  published: boolean
) {
  await db
    .query(
      `
    update documents
    set published = ?
    where collection = ?
    and id = ?
  `
    )
    .run(published, collection, id)
}
