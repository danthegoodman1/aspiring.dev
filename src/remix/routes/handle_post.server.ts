import { ActionFunctionArgs, json } from "@remix-run/node"
import { logger } from "src/logger"
import { AuthSession } from "~/auth/authenticator"
import {
  ActionData,
  postRowIDName,
  publishedName,
  publishedSlug,
  slugName,
  zipFileName,
} from "./admin.posts"
import AdmZip from "adm-zip"
import { s3Client } from "src/s3/client.server"
import {
  getLatestDocumentByID,
  getLatestDocumentBySlug,
  insertDocumentVersion,
  setDocumentPublishStatus,
} from "src/db/documents.server"
import { getAssetS3Path, getMarkdownS3Path } from "~/markdown/paths"
import { randomUUID } from "crypto"

export async function handlePostUpload(
  user: AuthSession,
  formData: FormData,
  args: ActionFunctionArgs
) {
  logger.debug("handling new post")
  const slug = formData.get(slugName)?.toString()
  if (!slug) {
    return json<ActionData>({
      error: "Missing slug",
    })
  }

  const zipFile = formData.get(zipFileName) as File | undefined
  if (!zipFile) {
    return json<ActionData>({
      error: "Missing zipFile",
    })
  }

  const zip = new AdmZip(Buffer.from(await zipFile.arrayBuffer()))
  var zipEntries = zip.getEntries() // an array of ZipEntry records

  let version = 0
  const existingDocument = await getLatestDocumentBySlug("posts", slug)
  if (existingDocument) {
    version = existingDocument.version + 1
  }
  const postID = existingDocument?.id || randomUUID()

  await Promise.all(
    zipEntries.map(async (entry) => {
      const isMarkdown = entry.name.endsWith(".md")
      const isAsset = entry.entryName.includes("assets/") && !entry.isDirectory

      if (isMarkdown) {
        // Check if first version

        let markdownContent = entry.getData().toString()
        const markdownLines = markdownContent.split("\n")
        const h1Location = markdownLines.findIndex((line) => {
          return line.startsWith("# ")
        })
        const h1Content = markdownLines[h1Location].slice(1).trim()

        // TODO: Handle banner image - right now I'm just not using it
        // if (
        //   h1Location !== 0 &&
        //   markdownLines[h1Location - 1].startsWith("![")
        // ) {
        //   // We have a banner image
        //   const line = markdownLines[h1Location - 1]
        //   const assetStart = line.lastIndexOf("(") + 1
        //   let assetPath = line.slice(assetStart, line.length - 1)
        //   assetPath = assetPath.replaceAll("assets/", `${postID}/assets/`)
        //   logger.debug(`Got asset path ${assetPath}`)
        // } else {
        //   logger.debug("no banner image detected")
        // }

        const descriptionLocation = markdownLines.findIndex((line) => {
          return line.startsWith("> ")
        })
        let description: string | null = null
        if (descriptionLocation - h1Location <= 2) {
          description = markdownLines[descriptionLocation].slice(1).trim()
          logger.debug(
            `Got description at ${descriptionLocation}: ${description}`
          )
        } else {
          logger.warn("got no description!")
        }

        // TODO: Rewrite assets to inject the slug, use regex to look for the assets path and replace it (if between [])
        markdownContent = rewriteImagePaths(markdownContent, postID)

        // Upload to S3
        const fileName = getMarkdownS3Path(version, postID)
        await s3Client.putObject({
          Bucket: process.env.S3_BUCKET,
          Key: fileName,
          Body: markdownContent, // TODO: waiting for bun to suppport compression https://github.com/oven-sh/bun/issues/1723 or zlib brotli
        })
        logger.debug(`Uploaded ${fileName} to s3`)

        // Create with highest version
        const created = new Date().getTime()
        await insertDocumentVersion({
          collection: "posts",
          created_ms: created, // this is ignored
          description,
          id: postID,
          name: h1Content,
          published: existingDocument?.published ?? false,
          slug,
          version,
          originally_created_ms: existingDocument
            ? existingDocument.originally_created_ms
            : created,
        })
        logger.debug(`Inserted post ID ${postID} version ${version} into DB`)
      } else if (isAsset) {
        // Upload asset
        const fileName = getAssetS3Path(postID, entry.name)
        await s3Client.putObject({
          Bucket: process.env.S3_BUCKET,
          Key: fileName,
          Body: entry.getData(), // TODO: waiting for bun to suppport compression https://github.com/oven-sh/bun/issues/1723 or zlib brotli
        })
        logger.debug(`Uploaded ${fileName} to s3`)
      }
    })
  )

  return json<ActionData>({
    success: "Uploaded post",
  })
}

export async function handlePostUpdate(
  formData: FormData,
  args: ActionFunctionArgs
) {
  logger.debug({ formData }, "updating post")
  const isPublished = formData.get(publishedName)?.toString() === "yes" // null when not published
  await setDocumentPublishStatus(
    "posts",
    formData.get(postRowIDName)?.toString()!,
    !!isPublished
  )
  const postID = formData.get(postRowIDName)!.toString()
  const document = (await getLatestDocumentByID("posts", postID))!
  const newSlug = formData.get(publishedSlug)!.toString()
  if (document.slug !== newSlug) {
    // Make a new version with new slug
    const created = new Date().getTime()

    // Copy the S3 asset
    await s3Client.copyObject({
      Bucket: process.env.S3_BUCKET,
      Key: getMarkdownS3Path(document.version + 1, postID),
      CopySource:
        process.env.S3_BUCKET +
        "/" +
        getMarkdownS3Path(document.version, postID),
    })

    await insertDocumentVersion({
      collection: "posts",
      created_ms: created, // this is ignored
      description: null,
      id: postID,
      name: "",
      published: isPublished,
      slug: newSlug,
      version: document.version + 1,
      originally_created_ms: document.originally_created_ms,
    })
  }
  return json<ActionData>({
    success: "Updated post",
  })
}

function rewriteImagePaths(markdown: string, stableID: string): string {
  // Find all images
  let lines = markdown.split("\n")

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (
      line.startsWith("![") &&
      line.includes("](assets/") &&
      line.endsWith(")")
    ) {
      logger.debug(`Rewrite image line ${line}`)
      // Get everything between the last ()
      const assetStart = line.lastIndexOf("(") + 1
      let assetPath = line.slice(assetStart, line.length - 1)
      logger.debug(`Asset path: ${assetPath}`)
      assetPath = assetPath.replaceAll("assets/", `${stableID}/assets/`)
      lines[i] = line.slice(0, assetStart) + assetPath + ")"
    }
  }

  return lines.join("\n")
}
