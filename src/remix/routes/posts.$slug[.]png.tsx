import { LoaderFunctionArgs, redirect } from "@remix-run/node"
import { Resvg } from "@resvg/resvg-js"
import satori from "satori"
import {
  getLatestDocumentByID,
  getLatestDocumentBySlug,
} from "src/db/documents.server"

import { interBold, interMedium, interRegular, interSemiBold } from "src/inter"

export async function loader(args: LoaderFunctionArgs) {
  const { slug } = args.params
  const initialDoc = await getLatestDocumentBySlug("posts", slug!)
  if (!initialDoc || !initialDoc?.published) {
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

  if (!doc || !doc?.published) {
    throw new Response("Updated doc not published", {
      status: 404,
    })
  }

  const svg = await satori(
    <div
      style={{
        display: "flex",
        padding: 16,
        width: "100%",
        height: "100%",
        background: "white",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          border: "black 6px solid",
          width: "100%",
          height: "100%",
          borderRadius: 16,
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            position: "absolute",
            top: 41,
            left: 48,
          }}
        >
          <p
            style={{
              fontSize: 91,
              fontWeight: 600,
              marginTop: -5,
              color: "black",
            }}
          >
            {doc.name}
          </p>
          <p
            style={{
              fontSize: 41,
              marginTop: 25,
              maxWidth: 1000,
              color: "black",
            }}
          >
            {doc.description}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            position: "absolute",
            bottom: 41,
            right: 48,
          }}
        >
          <p
            style={{
              fontSize: 46,
              color: "black",
              marginTop: -10,
              fontWeight: 600,
            }}
          >
            aspiring.dev
          </p>
        </div>
        <div
          style={{
            display: "flex",
            position: "absolute",
            bottom: 41,
            left: 48,
          }}
        >
          <p
            style={{
              fontSize: 46,
              color: "#919191",
              marginTop: -5,
              fontWeight: 600,
            }}
          >
            Dan Goodman -{" "}
            {new Date(doc.originally_created_ms).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Inter",
          data: interRegular,
          weight: 400,
          style: "normal",
        },
        {
          name: "Inter",
          data: interMedium,
          weight: 500,
          style: "normal",
        },
        {
          name: "Inter",
          data: interSemiBold,
          weight: 600,
          style: "normal",
        },
        {
          name: "Inter",
          data: interBold,
          weight: 700,
          style: "normal",
        },
      ],
    }
  )

  const resvg = new Resvg(svg, {
    dpi: 96,
    shapeRendering: 2,
    textRendering: 2,
    imageRendering: 0,
  })
  const png = resvg.render()

  return new Response(png.asPng(), {
    headers: {
      "content-type": "image/png",
      // TODO: Add etag headers
      // no cache because we are using for analytics
    },
  })
}
