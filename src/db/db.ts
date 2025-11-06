import { createClient } from "@libsql/client"
import { drizzle } from "drizzle-orm/libsql/node"
import { DATABASE_URL, NODE_ENV } from "../config"

const client = createClient({
	url:
		NODE_ENV === "production"
			? DATABASE_URL
			: "file:C:/Users/oliva/Documents/Proyectos/orderburger-backend/src/db/local.db"
	// authToken: DATABASE_AUTH_TOKEN
})

export default drizzle(client)
