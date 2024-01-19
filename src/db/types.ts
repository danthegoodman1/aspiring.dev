export interface DocumentRow {
  collection: string
  id: string
  /**
   * Increment on update
   */
  version: number
  /**
   * Support renaming the slug, redirecting to the new slug
   */
  slug: string[]
  /**
   * E.g. a title, pulled from the first h1 in markdown on upload
   */
  name: string
  /**
   * To the markdown file
   */
  markdown_path: string
  originally_created_ms: number
  updated_ms: number
}
