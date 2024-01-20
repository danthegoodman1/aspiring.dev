import { ActionFunctionArgs, json } from "@remix-run/node"
import { logger } from "src/logger"
import { AuthSession } from "~/auth/authenticator"
import { slugName, zipFileName } from "./admin.posts"
import AdmZip from "adm-zip"
import path from "path"
import { s3Client } from "src/s3/client.server"
import { getLatestDocumentBySlug } from "src/db/documents.server"

export async function handlePostUpload(
  user: AuthSession,
  formData: FormData,
  args: ActionFunctionArgs
) {
  logger.debug("handling new post")
  const slug = formData.get(slugName)?.toString()
  if (!slug) {
    return json({
      error: "Missing slug",
    })
  }

  const zipFile = formData.get(zipFileName) as File | undefined
  if (!zipFile) {
    return json({
      error: "Missing zipFile",
    })
  }

  const zip = new AdmZip(Buffer.from(await zipFile.arrayBuffer()))
  var zipEntries = zip.getEntries() // an array of ZipEntry records

  await Promise.all(
    zipEntries.map(async (entry) => {
      const isMarkdown = entry.name.endsWith(".md")
      const isAsset = entry.entryName.includes("assets/") && !entry.isDirectory

      if (isMarkdown) {
        // Check if first version
        let version = 0
        const existingDocument = await getLatestDocumentBySlug("posts", slug)
        if (existingDocument) {
          version = existingDocument.version + 1
        }

        const markdownContent = entry.getData().toString()
        // TODO: extract banner image from before h1
        // TODO: extract title from first h1
        // TODO: extract description from quote following a1

        // Upload to S3
        const fileName = `posts/${slug}/${version}.md`
        await s3Client.putObject({
          Bucket: process.env.S3_BUCKET,
          Key: fileName,
          Body: entry.getData(), // TODO: waiting for bun to suppport compression https://github.com/oven-sh/bun/issues/1723 or zlib brotli
        })
        logger.debug(`Uploaded ${fileName} to s3`)

        // Create with highest version
      } else if (isAsset) {
        // Upload asset
        const fileName = `posts/${slug}/assets/${entry.name}`
        await s3Client.putObject({
          Bucket: process.env.S3_BUCKET,
          Key: fileName,
          Body: entry.getData(), // TODO: waiting for bun to suppport compression https://github.com/oven-sh/bun/issues/1723 or zlib brotli
        })
        logger.debug(`Uploaded ${fileName} to s3`)
      }
    })
  )

  return null
}
