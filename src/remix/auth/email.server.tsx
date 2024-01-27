// app/services/email.server.tsx
import { renderToString } from "react-dom/server"
import type { SendEmailFunction } from "remix-auth-email-link"
import { UserRow } from "src/db/types"
// import * as emailProvider from "~/services/email-provider.server"

export let sendEmail: SendEmailFunction<UserRow> = async (options) => {
  let subject = "Here's your Magic sign-in link"
  let body = renderToString(
    <p>
      Hello there!
      <br />
      <br />
      <a href={options.magicLink}>Click here to login on example.app</a>
    </p>
  )

  console.log(body)

  // await emailProvider.sendEmail(options.emailAddress, subject, body)
}
