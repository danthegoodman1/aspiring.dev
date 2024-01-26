export function getMarkdownS3Path(version: number, stableID: string) {
  return `posts/${stableID}/${version}.md`
}

export function getAssetS3Path(stableID: string, fileName: string) {
  return `posts/${stableID}/assets/${fileName}`
}
