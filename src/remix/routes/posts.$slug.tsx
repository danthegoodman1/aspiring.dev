import { LoaderFunctionArgs, json, redirect } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { renderToString } from "react-dom/server"
import {
  getLatestDocumentByID,
  getLatestDocumentBySlug,
} from "src/db/documents.server"
import { logger } from "src/logger"
import { s3Client } from "src/s3/client.server"
import { authenticator } from "~/auth/authenticator"
import MarkdownRenderer from "~/components/MarkdownRenderer.server"
import { getMarkdownS3Path } from "~/markdown/paths"

export async function loader(args: LoaderFunctionArgs) {
  const { slug } = args.params
  const initialDoc = await getLatestDocumentBySlug("posts", slug!)
  if (!initialDoc?.published) {
    // Throw not found
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    })
  }

  // Get the most recent one for that ID
  const doc = await getLatestDocumentByID("posts", initialDoc.id)
  if (doc?.slug !== initialDoc.slug) {
    // Redirect to the new slug
    return redirect(`/posts/${doc?.slug}`)
  }

  // Load the content
  const post = await s3Client.getObject({
    Bucket: process.env.S3_BUCKET,
    Key: getMarkdownS3Path(doc.version, doc.id),
  })
  const postString = await post.Body?.transformToString()
  if (!postString) {
    logger.error(
      {
        slug,
        s3Key: getMarkdownS3Path(doc.version, doc.id),
      },
      "Failed to get post"
    )
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    })
  }

  const user = await authenticator.isAuthenticated(args.request)

  const jsx = (
    <div className="w-[95%] max-w-[768px] mx-auto">
      <p className="text-neutral-400 mb-2">
        <a target="_blank" href="https://twitter.com/Dan_The_Goodman">
          Dan Goodman (@dan_the_goodman)
        </a>{" "}
        - {new Date(doc.originally_created_ms).toLocaleDateString()}
      </p>
      <MarkdownRenderer
        content={postString}
        variables={{
          subscribed: !!user?.subscription,
        }}
      />
    </div>
  )

  const rendered = renderToString(jsx)
  return json({
    rendered,
  })
}

export default function Post() {
  const data = useLoaderData<typeof loader>()
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: data.rendered,
      }}
    />
  )
}
