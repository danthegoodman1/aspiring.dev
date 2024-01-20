import { LoaderFunctionArgs, redirect } from "@remix-run/node"
import { isAdminEmail } from "src/utils.server"
import { authenticator } from "~/auth/authenticator"

export async function loader(args: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(args.request)
  if (!user || !isAdminEmail(user.email)) {
    return redirect("/wtf-do-you-think-you-are-doing-son")
  }

  return null
}
