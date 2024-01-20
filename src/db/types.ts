export interface DocumentRow {
  collection: string
  id: string
  /**
   * Increment on update
   */
  version: number
  published: boolean
  /**
   * Slugs of old posts will redirect to the most recent version
   */
  slug: string
  /**
   * E.g. a title, pulled from the first h1 in markdown on upload
   */
  name: string
  /**
   * If a quote-block exists right below the first h1, grab it
   */
  description?: string
  /**
   * If there is an image before the first h1, store that for preview generation
   */
  banner_path?: string
  /**
   * To the markdown file
   */
  markdown_path: string
  /**
   * Creation of the row. Can get initial blog post with the min(created_ms), and most recent update with max(created_ms)
   */
  created_ms: number
}

export interface UserRow {
  id: string
  email: string

  email_on_post: boolean
  subscription?: string
}

export interface SignInCodeRow {
  code: string
  email: string
  created_ms: number
}
