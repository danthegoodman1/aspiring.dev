export function getMarkdownS3Path(version: number, slug: string) {
  return `posts/${slug}/${version}.md`
}

export function getAssetS3Path(slug: string, fileName: string) {
  return `posts/${slug}/assets/${fileName}`
}
