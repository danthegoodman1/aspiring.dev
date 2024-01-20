import { Database } from "bun:sqlite"
import { logger } from "src/logger"
import { readFile } from "fs/promises"
import path from "path"

const dbFileName = process.env.DB_FILENAME ?? "sqlite.db"
export const db = new Database(dbFileName, {
  create: true,
})
db.exec("PRAGMA journal_mode = WAL;")
logger.debug(`Using db file "${dbFileName}"`)
logger.debug(`Running schema.sql`)
const schema = (
  await readFile(path.join(import.meta.dir, "schema.sql"))
).toString()
schema
  .split(";")
  .filter((stmt) => stmt.trim() !== "")
  .map((stmt) => {
    db.exec(stmt.trim())
  })
logger.debug("Loaded schema")
