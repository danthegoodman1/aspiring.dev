import { logger } from "src/logger"
import { db } from "."
import { UserRow } from "./types"
import { extractError } from "src/utils"

export function createOrGetUser(id: string, email: string): UserRow {
  try {
    const user = db
      .query(
        `
    select *
    from users
    where id = ?
  `
      )
      .get(id) as UserRow | undefined
    if (!user) {
      // Create it
      db.query(`insert into users (id, email) values (?, ?)`).run(id, email)

      // Return it
      return {
        id,
        email,
        email_on_post: false,
      }
    }

    return user
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
