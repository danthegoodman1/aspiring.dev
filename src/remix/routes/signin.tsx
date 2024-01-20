// import { LoaderFunctionArgs, redirect } from "@remix-run/node"
// import { signinRedirectCookie } from "~/auth/signin_redirect_cookie"

// export async function loader(args: LoaderFunctionArgs) {
//   const searchParams = new URL(args.request.url).searchParams
//   const redirectTo = searchParams.get("redirectTo")

//   try {
//     return await authenticator.authenticate(
//       huggingfaceAuthenticator,
//       args.request,
//       {
//         successRedirect: "/", // this is overridden below
//         throwOnError: true,
//       }
//     )
//   } catch (error) {
//     // Because redirects work by throwing a Response, you need to check if the
//     // caught error is a response and return it or throw it again
//     if (error instanceof Response) {
//       // Let's inject the cookie to set
//       if (redirectTo) {
//         error.headers.set(
//           "set-cookie",
//           await signinRedirectCookie.serialize(redirectTo)
//         )
//       }
//       throw error
//     }

//     return redirect(
//       "/signin?failed=" + encodeURIComponent((error as Error).message)
//     )
//   }
// }
