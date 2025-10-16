import { sql } from "drizzle-orm"
import { sqliteTable, text } from "drizzle-orm/sqlite-core"

export const ImagesTable = sqliteTable("images", {
	image_id: text("image_id").primaryKey().notNull(),
	url: text("url").notNull().unique(),
	email: text("email").notNull(),
	format: text("format").notNull(),
	created_at: text("created_at").default(sql`(CURRENT_TIMESTAMP)`)
})
