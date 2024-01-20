import { Database } from "bun:sqlite"
import { logger } from "src/logger"

const dbFileName = process.env.DB_FILENAME ?? "sqlite.db"
export const db = new Database(dbFileName, {
  create: true,
})
db.exec("PRAGMA journal_mode = WAL;")
logger.debug(`Using db file "${dbFileName}"`)
