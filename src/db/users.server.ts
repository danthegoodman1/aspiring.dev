import { logger } from "src/logger"
import { db } from "./db.server"
import { UserRow } from "./types"
import { extractError } from "src/utils"
import { RowsNotFound } from "./errors"

export async function createOrGetUser(
  id: string,
  email: string
): Promise<UserRow> {
  try {
    let user = db
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
      user = db
        .query(`insert into users (id, email) values (?, ?) returning *`)
        .get(id, email) as UserRow
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

export function selectUser(id: string): UserRow {
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
    throw new RowsNotFound()
  }
  return user
}
