// app/services/email.server.tsx
import { renderToString } from "react-dom/server"
import type { SendEmailFunction } from "remix-auth-email-link"
import { UserRow } from "src/db/types"
// import * as emailProvider from "~/services/email-provider.server"

export let sendEmail: SendEmailFunction<UserRow> = async (options) => {
  let body = renderToString(
    <div
      style={{
        fontFamily: "sans-serif",
      }}
    >
      <p>
        Hello there!
        <br />
        <br />
        <a href={options.magicLink}>Click here to login to aspiring.dev</a>
      </p>
    </div>
  )

  console.log(body, options.emailAddress)

  const res = await fetch("https://api.postmarkapp.com/email/batch", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "X-Postmark-Server-Token": process.env.POSTMARK_TOKEN,
    },
    body: JSON.stringify([
      {
        From: "auth@aspiring.dev",
        To: options.emailAddress,
        Subject: "aspiring.dev SignIn Link",
        TextBody: `Hello there!\n\nUse ${options.magicLink} to login to aspiring.dev`,
        HtmlBody: body,
        MessageStream: "outbound",
      },
    ]),
  })
  console.log(res.status, await res.text())
}
