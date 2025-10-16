import { defineConfig } from "drizzle-kit"

export default defineConfig({
	schema: "./src/db/schema.ts",
	out: "./src/db/migrations",
	dbCredentials: { url: process.env.DATABASE_URL },
	dialect: "sqlite",
	verbose: true,
	strict: true
})
