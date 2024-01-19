import { Database } from "bun:sqlite"
import { logger } from "src/logger"

const dbFileName = process.env.DB_FILENAME ?? "aspiring.dev.db"
export const db = new Database(dbFileName, {
  create: true,
})
logger.debug(`Using db file "${dbFileName}"`)
db.exec("PRAGMA journal_mode = WAL;")
