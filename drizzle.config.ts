import { defineConfig } from "drizzle-kit"
import { DATABASE_AUTH_TOKEN, DATABASE_URL } from "./src/config"

export default defineConfig({
	dialect: "turso",
	schema: "./src/db/schema.ts",
	out: "./src/db/migrations",
	dbCredentials: { url: DATABASE_URL, authToken: DATABASE_AUTH_TOKEN },
	verbose: true,
	strict: true
})
