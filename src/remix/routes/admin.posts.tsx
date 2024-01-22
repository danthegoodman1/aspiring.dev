import { faWarning } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node"
import {
  Form,
  useActionData,
  useFetcher,
  useLoaderData,
  useNavigation,
} from "@remix-run/react"
import { authenticator } from "~/auth/authenticator"
import { handlePostUpdate, handlePostUpload } from "./handle_post.server"
import { listLatestDocumentsForCollection } from "src/db/documents.server"
import { classNames, getSQLiteDate } from "src/utils"
import { Switch } from "@headlessui/react"
import { DocumentListItem, DocumentRow } from "src/db/types"
import { useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"

export const newPostName = "newPost"
export const zipFileName = "zipFile"
export const slugName = "slug"

export const postRowName = "postRow"
export const publishedName = "postPublished"

export async function action(args: ActionFunctionArgs) {
  const user = await authenticator.isAuthenticated(args.request)

  const formData = await unstable_parseMultipartFormData(
    args.request,
    unstable_createMemoryUploadHandler({
      maxPartSize: 10_000_000, // 10MB
    })
  )
  const isNewPost = formData.get(newPostName)?.toString() === "true"
  if (isNewPost) {
    return handlePostUpload(user!, formData, args)
  }

  const isPostUpdate = formData.get(postRowName)?.toString()
  if (isPostUpdate) {
    return handlePostUpdate(formData, args)
  }

  return null
}

export async function loader(args: LoaderFunctionArgs) {
  const posts = await listLatestDocumentsForCollection("posts")
  console.log(posts)

  return json({
    posts,
  })
}

export interface ActionData {
  success?: string
  error?: string
}

export default function AdminPosts() {
  const data = useLoaderData<typeof loader>()
  const nav = useNavigation()
  const saving = nav.state !== "idle"
  const actionData = useActionData<typeof action>()

  useEffect(() => {
    if (actionData?.error) {
      toast.error(actionData.error)
    }
    if (actionData?.success) {
      toast.success(actionData.success)
    }
  }, [actionData])

  return (
    <div className="flex flex-col gap-2 mb-10">
      {actionData && actionData.error && (
        <div className="w-full px-4 py-3 flex items-center gap-3 rounded-lg bg-red-200">
          <p className="flex gap-2 items-center">
            <FontAwesomeIcon icon={faWarning} width={16} /> {actionData.error}
          </p>
        </div>
      )}
      <h1>Posts</h1>
      <Form
        encType="multipart/form-data"
        method="post"
        className="flex gap-4 flex-col border-2 border-black p-4 rounded-lg"
      >
        <p>Create a new post, or update an existing one</p>
        <input type="hidden" name={newPostName} value={"true"} />
        <div className="flex gap-2 flex-col sm:flex-row items-bottom">
          <div className="flex flex-col gap-2">
            <label>TextPack</label>
            <input name={zipFileName} type="file" />
          </div>
          <div className="flex flex-col gap-2">
            <label>Slug</label>
            <input
              name={slugName}
              type="text"
              placeholder="slug-name-here"
              className="px-2 py-1 border-black border-2 rounded-md"
            />
          </div>
        </div>
        <button
          disabled={saving}
          className="rounded-md py-2 px-6 bg-black text-white flex items-center justify-center grow-0 text-sm hover:bg-neutral-700 disabled:bg-neutral-700 self-baseline"
        >
          Publish
        </button>
      </Form>
      <div className="flex mt-4 flex-col gap-10">
        {data.posts?.map((post) => {
          return <PostRow key={post.id} {...post} />
        })}
      </div>
    </div>
  )
}

interface PostRowProps extends DocumentListItem {}

function PostRow(props: PostRowProps) {
  const fetcher = useFetcher<ActionData>()
  const isPublished = !!(
    fetcher.formData?.get(publishedName) ?? props.published
  )

  useEffect(() => {
    if (fetcher.data?.error) {
      toast.error(fetcher.data.error)
    }
    if (fetcher.data?.success) {
      toast.success(fetcher.data.success)
    }
  }, [fetcher.data])

  return (
    <fetcher.Form
      encType="multipart/form-data"
      method="post"
      key={props.id}
      className="flex-col sm:flex-row flex gap-4 border-2 border-black p-4 rounded-lg justify-between"
      onSubmit={(e) => {
        if (!window.confirm(`Change publish status on "${props.name}"?`)) {
          e.preventDefault()
        }
      }}
    >
      <input type="hidden" name={postRowName} value={props.id} />
      <div className="flex gap-4">
        <div className="flex-col flex gap-2 w-full">
          <h3>
            {props.name} {props.name} {props.name} {props.name}{" "}
            <span className="ml-2 text-base text-neutral-400">
              /posts/{props.slug}
            </span>
          </h3>
          {props.banner_path ? (
            <img
              className="border-2 border-black rounded-lg h-32 w-56 aspect-video"
              src={props.banner_path}
              alt={props.slug}
            />
          ) : (
            <div className="h-32 w-56 rounded-lg aspect-video border-black border-2 flex items-center justify-center">
              <p>No image</p>
            </div>
          )}
          <p>{props.description ?? "No description"}</p>
        </div>
      </div>

      <div className="flex-col gap-2 h-full flex sm:items-end">
        <p className="text-left sm:text-right text-neutral-400">
          Version: <br />
          <span className="text-black">{props.version}</span>
        </p>
        <p className="text-left sm:text-right text-neutral-400">
          Originally Posted: <br />
          <span className="text-black">
            {getSQLiteDate(props.originally_created).toLocaleString()}
          </span>
        </p>
        <div className="flex gap-2 items-center mr-auto sm:mr-0">
          <button name={publishedName} value={isPublished ? "no" : "yes"}>
            <p
              className={classNames(
                isPublished ? "text-green-600" : "text-neutral-400"
              )}
            >
              {isPublished ? "Published " : "Unpublished "}
              {isPublished ? "✅" : "⬜️"}
            </p>
          </button>
        </div>
      </div>
    </fetcher.Form>
  )
}
