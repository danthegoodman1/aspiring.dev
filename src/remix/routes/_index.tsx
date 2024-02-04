import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import { listLatestDocumentsForCollection } from "src/db/documents.server"
import { DocumentRow } from "src/db/types"
import AboutSimple from "~/components/AboutSimple"

export const meta: MetaFunction = () => {
  return [
    { title: "aspiring.dev" },
    { name: "description", content: "Just a blog about coding projects!" },
  ]
}

export async function loader(args: LoaderFunctionArgs) {
  const posts = await listLatestDocumentsForCollection("posts", {
    requirePublished: true,
  })

  return json({
    posts,
  })
}

function Index() {
  const data = useLoaderData<{ posts: DocumentRow[] | undefined }>()

  return (
    <div className="flex flex-col gap-4 mb-10">
      <article className="flex flex-col self-center max-w-[1000px] gap-4 p-6 rounded-xl border-neutral-600 border-2 mb-4">
        <h4 className="text-neutral-700 font-semibold">About aspiring.dev:</h4>
        <AboutSimple />
      </article>
      <h1 className="font-bold">Posts</h1>
      <div className="flex flex-col gap-6 sm:gap-10">
        {data.posts?.map((post) => {
          return <Post key={post.id} {...post} />
        })}
      </div>
    </div>
  )
}

export default Index

function Post(props: DocumentRow) {
  const postDate = new Date(props.originally_created_ms).toLocaleDateString()

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
          <div className="flex flex-col sm:flex-grow sm:gap-4 gap-6 items-center sm:items-start grow">
            <div className="flex flex-col sm:gap-4 items-center sm:items-start w-full">
              <div className="flex flex-col items-center sm:items-start w-full gap-2 sm:gap-0">
                <h2 className="text-center sm:text-left flex-grow">
                  {props.name}
                </h2>
                <p className="text-left sm:text-right text-neutral-400">
                  {postDate}
                </p>
              </div>
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
