import { createCookieSessionStorage } from "@remix-run/node"
import { Authenticator } from "remix-auth"
import { OAuth2Strategy } from "remix-auth-oauth2"
import { createOrGetUser } from "src/db/users.server"

import { logger } from "src/logger"
import { extractError } from "src/utils"
import { isAdminEmail } from "src/utils.server"

// export the whole sessionStorage object
export let sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "_session",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secrets: [process.env.COOKIE_SECRET!],
    secure: process.env.NODE_ENV === "production", // enable this in prod only
    maxAge: 3600 * 24 * 14, // 2 weeks
  },
})

export interface AuthSession {
  id: string
  email: string
  isAdmin: boolean
  subscription?: string
}

export let authenticator = new Authenticator<AuthSession>(sessionStorage)

//TODO: TEMP

interface DecodedIDToken {
  sub: string
  name: string
  preferred_username: string
  profile: string
  picture: string
  email: string
  email_verified: boolean
  aud: string
  auth_time: number
  iat: number
  exp: number
  iss: string
}

authenticator.use(
  new OAuth2Strategy(
    {
      authorizationURL: "https://huggingface.co/oauth/authorize",
      tokenURL: "https://huggingface.co/oauth/token",
      clientID: process.env.HF_CLIENT_ID!,
      clientSecret: process.env.HF_CLIENT_SECRET!,
      useBasicAuthenticationHeader: true,
      callbackURL: process.env.MY_URL + "/auth/callback",
      scope: "openid profile email read-repos manage-repos",
    },
    async ({ accessToken, extraParams, profile, context, request }) => {
      // NOTE: Huggingface does not give refresh tokens, meaning there is no offline/headless access.
      // Access Tokens expire after 1 hour (3600 seconds).
      // This means that any API-level access will not be able to interface with huggingface.

      try {
        const idToken: DecodedIDToken = JSON.parse(
          Buffer.from(
            (extraParams.id_token as string).split(".")[1],
            "base64"
          ).toString("utf8")
        )

        logger.debug(
          {
            accessToken,
            ...idToken,
          },
          "got user"
        )

        const user = await createOrGetUser(idToken.sub, idToken.email)

        return {
          ...user,
          isAdmin: isAdminEmail(user.email),
        }
      } catch (error) {
        logger.error(
          {
            err: extractError(error),
          },
          "error in createOrGetUser"
        )
        throw error
      }
    }
  ),
  // this is optional, but if you setup more than one OAuth2 instance you will
  // need to set a custom name to each one
  "huggingface"
)

export const huggingfaceAuthenticator = "huggingface"
