import { drizzle } from "drizzle-orm/libsql/node"
import { DATABASE_AUTH_TOKEN, DATABASE_URL } from "../config"

const db = drizzle({ connection: { url: DATABASE_URL, authToken: DATABASE_AUTH_TOKEN } })

export default db
