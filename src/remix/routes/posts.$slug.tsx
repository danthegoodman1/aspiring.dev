import {
  LoaderFunctionArgs,
  MetaFunction,
  json,
  redirect,
} from "@remix-run/node"
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
import JoinCTA from "~/components/JoinCTA"
import MarkdownRenderer from "~/components/MarkdownRenderer.server"
import PostFooter from "~/components/PostFooter"
import { getMarkdownS3Path } from "~/markdown/paths"

export const meta: MetaFunction<typeof loader> = ({
  data,
  matches,
  params,
}) => {
  if (!data) {
    return matches.flatMap((match) => match.meta ?? [])
  }

  const { slug } = params

  return [
    { title: `${data.name}` },
    {
      property: "og:title",
      content: `${data.name}`,
    },
    {
      name: "description",
      content: data.description,
    },
    {
      property: "og:description",
      content: data.description,
    },
    {
      property: "og:image",
      content: `https://aspiring.dev/posts/${slug}.png`,
    },
    {
      property: "twitter:image",
      content: `https://aspiring.dev/posts/${slug}.png`,
    },
  ]
}

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
  const isSubbed = user
    ? !!user.subscription || isAdminEmail(user.email)
    : false

  const jsx = (
    <div className="w-[95%] max-w-[768px] mx-auto mb-10">
      <p className="text-neutral-400 mb-2">
        {new Date(doc.originally_created_ms).toLocaleDateString()}
      </p>
      <MarkdownRenderer
        content={postString}
        variables={{
          subscribed: isSubbed,
        }}
      />
      {!user && (
        <div className="mt-10 w-full">
          <JoinCTA emailName={emailName} />
        </div>
      )}
      <PostFooter />
    </div>
  )

  const rendered = renderToString(jsx)
  return json({
    rendered,
    name: doc.name,
    description: doc.description,
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
