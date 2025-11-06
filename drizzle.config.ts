import { defineConfig } from "drizzle-kit"
import { DATABASE_URL, NODE_ENV } from "./src/config"

export default defineConfig({
	dialect: NODE_ENV === "production" ? "turso" : "sqlite",
	schema: "./src/db/schema.ts",
	out: "./migrations",
	dbCredentials: {
		url: DATABASE_URL
		// authToken: DATABASE_AUTH_TOKEN
	},
	verbose: true,
	strict: true
})
