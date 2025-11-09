import { createClient } from "@libsql/client"
import { drizzle } from "drizzle-orm/libsql/node"
import { DATABASE_AUTH_TOKEN, DATABASE_URL } from "../config"

const client = createClient({
	url: DATABASE_URL,
	authToken: DATABASE_AUTH_TOKEN
})

export default drizzle(client)
