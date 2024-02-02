import { faWarning } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Switch } from "@headlessui/react"
import { ActionFunctionArgs, json } from "@remix-run/node"
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
  useRouteError,
} from "@remix-run/react"
import { useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"
import { LoaderFunctionArgs } from "react-router"
import { selectUser, setUserNotification } from "src/db/users.server"
import { classNames } from "src/utils"
import { authenticator } from "~/auth/authenticator"

const subscribeName = "subscribe"
const notificationsName = "notifications"

interface ActionResponse {
  error?: string
  success?: string
}

export async function loader(args: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(args.request, {
    failureRedirect: "/signin",
  })

  const userInfo = await selectUser(user.id)

  return json({
    user,
    userInfo,
    env: process.env.NODE_ENV,
  })
}

export async function action(args: ActionFunctionArgs) {
  const user = await authenticator.isAuthenticated(args.request, {
    failureRedirect: "/signin",
  })

  const formData = await args.request.formData()
  await setUserNotification(
    user.id,
    formData.get(notificationsName)?.toString() === "on"
  )
  return json({
    success: "Updated!",
  } as ActionResponse)
}

export default function Settings() {
  const data = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()
  const nav = useNavigation()
  const saving = nav.state !== "idle"
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (saving) {
      formRef.current?.reset()
    }
  }, [saving])

  useEffect(() => {
    if (actionData?.error) {
      toast.error(actionData.error)
    }
    if (actionData?.success) {
      toast.success(actionData.success)
    }
  }, [actionData])

  const [notificationsOn, setNotificationsOn] = useState(
    !!data.userInfo.email_on_post
  )

  useEffect(() => {
    setNotificationsOn(!!data.userInfo.email_on_post)
  }, [data])

  return (
    <div className="flex flex-col gap-2 mb-10">
      {actionData && actionData.error && (
        <div className="w-full px-4 py-3 flex items-center gap-3 rounded-lg bg-red-200">
          <p className="flex gap-2 items-center">
            <FontAwesomeIcon icon={faWarning} width={16} /> {actionData.error}
          </p>
        </div>
      )}
      <h1>Settings</h1>
      <div className="flex mt-4 flex-col gap-10">
        {/* <div className="rounded-md border-2 border-black px-6 py-4 flex flex-col gap-3">
          <div className="flex flex-col">
            <h3 id="plan">
              {data.user.subscription ? "Subscribed!" : "Not subscribed"}
            </h3>
          </div>
          <Form
            onSubmit={(e) => {
              if (data.user.subscription) {
                if (
                  !confirm(
                    "Are you sure you want to downgrade? Your repos will remain active for sale unless you remove them."
                  )
                ) {
                  e.preventDefault()
                }
              }
            }}
            ref={formRef}
            method="post"
            className="flex flex-col gap-1"
          >
            {!data.user.subscription && (
              <>
                <input type="hidden" name={subscribeName} value="true" />
                <button
                  disabled={saving}
                  className="rounded-md py-2 px-6 bg-black text-white flex items-center justify-center grow-0 text-sm hover:bg-neutral-700 disabled:bg-neutral-700 mt-4 self-baseline"
                >
                  Subscribe - $7/mo
                </button>
              </>
            )}
            {data.user.subscription && (
              <>
                <div className="flex items-center gap-4">
                  <Link
                    to={
                      data.env === "production"
                        ? "https://billing.stripe.com/p/login/4gw8yT3ND75b18cdQQ"
                        : "https://billing.stripe.com/p/login/test_14kcQNbkvbZNbyUaEE"
                    }
                    className="rounded-md py-2 px- flex items-center justify-center text-sm mt-4 self-baseline"
                  >
                    Manage subscription on Stripe
                  </Link>
                </div>
              </>
            )}
          </Form>
        </div> */}

        <div className="rounded-md border-2 border-black px-6 py-4 flex flex-col gap-3">
          <h3 id="huggingface">Notifications</h3>
          <Form ref={formRef} method="post" className="flex flex-col gap-1">
            <div className="flex gap-2 items-center">
              <Switch
                className={({ checked }) =>
                  classNames(
                    "w-[46px] rounded-full h-[24px] flex items-center",
                    checked ? "bg-black" : "bg-neutral-200"
                  )
                }
                name={notificationsName}
                onChange={() => {
                  setNotificationsOn(!notificationsOn)
                }}
                checked={notificationsOn}
              >
                {({ checked }) => (
                  <span
                    aria-hidden="true"
                    className={`${
                      checked ? "translate-x-[23px]" : "translate-x-[1px]"
                    }
              pointer-events-none inline-block h-[21px] w-[21px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                  />
                )}
              </Switch>
              <label>Receive emails notifications about new posts</label>
            </div>
            <button
              disabled={saving}
              className="rounded-md py-2 px-6 bg-black text-white flex items-center justify-center grow-0 text-sm hover:bg-neutral-700 disabled:bg-neutral-700 mt-4 self-baseline"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </Form>
        </div>
      </div>
    </div>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()
  console.error(error)
  return (
    <div className="flex w-full h-full justify-center items-stretch">
      <div className="flex w-full h-full flex-col gap-2 bg-red-200 p-2 items-center justify-center rounded-lg">
        <h4>Error:</h4>
        <code>{(error as Error).message}</code>
        <p className="text-sm">
          (If this is an internal error, we've already been notified!)
        </p>
      </div>
    </div>
  )
}
