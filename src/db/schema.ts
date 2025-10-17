import { sql } from "drizzle-orm"
import { sqliteTable, text } from "drizzle-orm/sqlite-core"

export const UserTable = sqliteTable("users", {
	_id: text("_id").primaryKey().notNull(),
	name: text("name").notNull().unique(),
	email: text("email").notNull().unique(),
	password: text("password").notNull(),
	role: text("role", { enum: ["admin", "user"] })
		.notNull()
		.default("user"),
	created_at: text("created_at").default(sql`(CURRENT_TIMESTAMP)`).notNull()
})
