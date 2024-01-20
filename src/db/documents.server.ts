import { db } from "./db.server"
import { DocumentRow } from "./types"

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
