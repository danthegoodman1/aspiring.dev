import type {
  LinksFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node"
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  json,
  useLoaderData,
  useRouteError,
} from "@remix-run/react"
import { logger } from "src/logger"
import { ServerOnly } from "remix-utils/server-only"
import { ClientOnly } from "remix-utils/client-only"

import stylesheet from "~/index.css"
import TopNav from "./components/TopNav"

// Fix icon resize on reload
import "@fortawesome/fontawesome-svg-core/styles.css" // not even sure this does anything
import { config } from "@fortawesome/fontawesome-svg-core"
import { Toaster } from "react-hot-toast"
import { authenticator } from "./auth/authenticator"
config.autoAddCss = false /* eslint-disable import/first */

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
]

export const meta: MetaFunction = () => {
  return [
    { title: "aspiring.dev" },
    {
      name: "description",
      content: "A code blog",
    },
    // {
    //   property: "og:image",
    //   content: "/sell-models-datasets.png",
    // },
    // {
    //   property: "twitter:image",
    //   content: "/sell-models-datasets.png",
    // },
  ]
}

export async function loader(args: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(args.request)
  logger.debug(
    {
      URL: args.request.url,
      userID: user?.id,
    },
    "loaded URL"
  )

  // Env vars for frontend
  const ENV: { [key: string]: string } = {}
  ENV["MY_URL"] = process.env.MY_URL!
  ENV["ENV"] = process.env.NODE_ENV!

  const url = new URL(args.request.url)
  return json({
    currentPath: url.pathname,
    user,
    ENV,
    shouldUseScrollRestoration: !url.pathname.startsWith("/posts"),
  })
}

declare global {
  interface Window {
    ENV: {
      MY_URL: string
      NODE_ENV: string
    }
  }
}

export default function App() {
  const data = useLoaderData<typeof loader>()
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <Toaster />
        <div className="max-w-[1400px] flex flex-col w-full mx-auto px-4 gap-3">
          <ServerOnly>
            {() => {
              return (
                <TopNav
                  isAdmin={data.user?.isAdmin}
                  redirectTo={data.currentPath}
                  authed={!!data.user}
                  subscribed={!!data.user?.subscription}
                />
              )
            }}
          </ServerOnly>
          <ClientOnly>
            {() => {
              return (
                <TopNav
                  isAdmin={data.user?.isAdmin}
                  redirectTo={window.location.pathname}
                  authed={!!data.user}
                  subscribed={!!data.user?.subscription}
                />
              )
            }}
          </ClientOnly>
          <Outlet />
        </div>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data.ENV)}`,
          }}
        />
        {/* <ScrollRestoration /> */}
        {data.shouldUseScrollRestoration && <ScrollRestoration />}
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <h1>
          {isRouteErrorResponse(error)
            ? `${error.status} ${error.statusText}`
            : error instanceof Error
            ? error.message
            : "Unknown Error"}
        </h1>
        <Scripts />
      </body>
    </html>
  )
}
