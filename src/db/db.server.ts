import sqlite from "sqlite3"
import { open } from "sqlite"

import { logger } from "src/logger"
import { readFile } from "fs/promises"
import path from "path"

const dbFileName = process.env.DB_FILENAME ?? "sqlite/sqlite.db"
export const db = await open({
  filename: dbFileName,
  driver: sqlite.Database,
})

export async function initDB() {
  logger.debug(`Using db file "${dbFileName}"`)
  await db.exec("PRAGMA journal_mode = WAL;")
  await db.exec("PRAGMA busy_timeout = 5000;")
  await db.exec("PRAGMA synchronous = NORMAL;")
  logger.debug(`Running schema.sql`)
  const schema = (
    await readFile(path.join("src", "db", "schema.sql"))
  ).toString()
  schema
    .split(";")
    .filter((stmt) => stmt.trim() !== "")
    .map((stmt) => {
      db.exec(stmt.trim())
    })
  logger.debug("Loaded schema")
}

// export async function prepareStatement(stmt: string): Promise<Statement> {
//   try {
//     return db.query(stmt)
//   } catch (error) {
//     if ((error as Error).message.includes("no such table")) {
//       await initDB()
//       return db.query(stmt)
//     }
//     throw error
//   }
// }
