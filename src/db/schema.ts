import { sql } from "drizzle-orm"
import * as t from "drizzle-orm/sqlite-core"
import { sqliteTable as table } from "drizzle-orm/sqlite-core"

export const UserTable = table(
	"users",
	{
		_id: t.text("_id").primaryKey().notNull(),
		name: t.text("name").notNull().unique(),
		email: t.text("email").notNull().unique(),
		password: t.text("password").notNull(),
		role: t
			.text("role", { enum: ["admin", "user"] })
			.notNull()
			.default("user"),
		created_at: t.text("created_at").default(sql`(CURRENT_TIMESTAMP)`).notNull()
	},
	(table) => [t.uniqueIndex("email_idx").on(table.email)]
)

export const ClientsTable = table(
	"clients",
	{
		_id: t.text("_id").primaryKey().notNull(),
		name: t.text("name").notNull().unique(),
		phone: t.text("phone").notNull(),
		created_at: t.text("created_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
		update_at: t.text("update_at"),
		user_id: t.text("user_id").references(() => UserTable._id)
	},
	(table) => [t.index("name_idx").on(table.name)]
)
