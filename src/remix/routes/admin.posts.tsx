import { faWarning } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  ActionFunctionArgs,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node"
import { Form, useActionData, useNavigation } from "@remix-run/react"
import { authenticator } from "~/auth/authenticator"
import { handlePostUpload } from "./handle_post.server"

export const newPostName = "newPost"
export const zipFileName = "zipFile"
export const slugName = "slug"

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

  return null
}

export default function AdminPosts() {
  const nav = useNavigation()
  const saving = nav.state !== "idle"
  const actionData = useActionData<typeof action>()

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
          New Post
        </button>
      </Form>
      <div className="flex mt-4 flex-col gap-10"></div>
    </div>
  )
}
