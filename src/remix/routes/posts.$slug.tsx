import { LoaderFunctionArgs, json, redirect } from "@remix-run/node"
import { Form, useLoaderData } from "@remix-run/react"
import { renderToString } from "react-dom/server"
import {
  getLatestDocumentByID,
  getLatestDocumentBySlug,
} from "src/db/documents.server"
import { logger } from "src/logger"
import { s3Client } from "src/s3/client.server"
import { isAdminEmail } from "src/utils.server"
import { authenticator } from "~/auth/authenticator"
import MarkdownRenderer from "~/components/MarkdownRenderer.server"
import { getMarkdownS3Path } from "~/markdown/paths"

export const emailName = "email"

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

  console.log(user ? !!user.subscription || isAdminEmail(user.email) : false)

  const jsx = (
    <div className="w-[95%] max-w-[768px] mx-auto mb-10">
      <p className="text-neutral-400 mb-2">
        <a target="_blank" href="https://twitter.com/Dan_The_Goodman">
          Dan Goodman (@Dan_The_Goodman)
        </a>{" "}
        - {new Date(doc.originally_created_ms).toLocaleDateString()}
      </p>
      <MarkdownRenderer
        content={postString}
        variables={{
          subscribed: user
            ? !!user.subscription || isAdminEmail(user.email)
            : false,
        }}
      />
      <form className="shadow-xl mt-10 border-2 border-black p-4 sm:p-6 flex flex-col justify-between rounded-lg">
        <h3>Join and get notified of new posts</h3>
        <h4 className="text-neutral-500">
          And subscribe to support more posts and see subscriber-only content!
        </h4>
        <input
          name={emailName}
          type="email"
          placeholder="Your email"
          className="px-3 my-4 py-2 border-black border-2 rounded-md drop-shadow-md"
        />
        <button className="rounded-md py-2 px-8 bg-black text-white flex items-center justify-center hover:bg-neutral-700 disabled:bg-neutral-700">
          Join
        </button>
      </form>
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
