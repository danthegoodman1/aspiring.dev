import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import { useEffect } from "react"
import { listLatestDocumentsForCollection } from "src/db/documents.server"
import { DocumentRow } from "src/db/types"

export const meta: MetaFunction = () => {
  return [
    { title: "aspiring.dev" },
    { name: "description", content: "Just a blog about coding projects!" },
  ]
}

export async function loader(args: LoaderFunctionArgs) {
  const posts = await listLatestDocumentsForCollection("posts")

  return json({
    posts,
  })
}

export default function Index() {
  const data = useLoaderData<typeof loader>()

  return (
    <div className="flex flex-col gap-4 mb-10">
      <h1 className="font-bold">Posts</h1>
      <div className="flex flex-col gap-6 sm:gap-10">
        {data.posts?.map((post) => {
          return <Post key={post.id} {...post} />
        })}
      </div>
    </div>
  )
}

function Post(props: DocumentRow) {
  return (
    <Link
      to={`/posts/${props.slug}`}
      className="flex flex-col sm:flex-row gap-4 border-2 border-black p-8 rounded-lg justify-between items-center sm:items-start !no-underline"
      onSubmit={(e) => {
        if (!window.confirm(`Change publish status on "${props.name}"?`)) {
          e.preventDefault()
        }
      }}
    >
      <div className="flex gap-4 w-full">
        <div className="flex-col items-start sm:flex-row flex gap-4 sm:gap-6 w-full">
          {/* {props.banner_path && (
            <img
              className="border-2 border-black rounded-lg h-32 w-56 aspect-video"
              src={props.banner_path}
              alt={props.slug}
            />
          )} */}
          <div className="flex flex-col sm:flex-grow sm:gap-4 gap-6 items-center sm:items-start grow">
            <div className="flex flex-col sm:flex-row sm:gap-4 items-center sm:items-start w-full">
              <h2 className="text-center sm:text-left flex-grow">
                {props.name ||
                  "Example post title Example post title Example post title Example post title Example post title Example post title "}
              </h2>
              <div className="grow"></div>
              <p className="text-left sm:text-right text-neutral-400 mt-2">
                Dan Goodman -{" "}
                {new Date(props.originally_created_ms).toLocaleDateString()}
              </p>
            </div>
            {props.description && (
              <p className="text-center sm:text-left text-neutral-600">
                {props.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
