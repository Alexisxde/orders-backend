import { sql } from "drizzle-orm"
import * as t from "drizzle-orm/sqlite-core"
import { sqliteTable as table } from "drizzle-orm/sqlite-core"
import { userRoleValues } from "../types/auth"
import { orderPaymentMethodValues, orderStatusValues } from "../types/order"
import { productsCategoriesValues } from "../types/product"

export const UserTable = table(
	"users",
	{
		_id: t.text("_id").primaryKey().notNull(),
		name: t.text("name").notNull(),
		email: t.text("email").notNull().unique(),
		password: t.text("password").notNull(),
		role: t.text("role", { enum: userRoleValues }).notNull().default("user"),
		created_at: t.text("created_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
		id_avatar: t.text("id_avatar").references(() => ImagesTable._id)
	},
	(table) => [t.uniqueIndex("email_idx").on(table.email)]
)

export type UserTableType = typeof UserTable.$inferInsert

export const OrdersTable = table(
	"orders",
	{
		_id: t.text("_id").primaryKey().notNull(),
		payment_method: t.text("payment_method", { enum: orderPaymentMethodValues }).notNull(),
		status: t.text("status", { enum: orderStatusValues }).default("on_hold"),
		name: t.text("name").notNull(),
		phone: t.text("phone"),
		total: t.numeric("total").notNull(),
		created_at: t.text("created_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
		user_id: t
			.text("user_id")
			.references(() => UserTable._id)
			.notNull()
	},
	(table) => [t.index("status_orders_idx").on(table.status), t.index("payment_method_idx").on(table.payment_method)]
)

export type OrdersTableType = typeof OrdersTable.$inferInsert

export const OrdersDetailsTable = table(
	"orders_details",
	{
		_id: t.text("_id").primaryKey().notNull(),
		quantity: t.int("quantity").notNull(),
		price: t.numeric("price").notNull(),
		observation: t.text("observation").default("Sin observación.").notNull(),
		order_id: t
			.text("order_id")
			.references(() => OrdersTable._id)
			.notNull(),
		product_id: t
			.text("product_id")
			.references(() => ProductsTable._id)
			.notNull()
	},
	(table) => [t.index("order_idx").on(table.order_id)]
)

export type OrdersDetailsTableType = typeof OrdersDetailsTable.$inferInsert

export const ProductsTable = table(
	"products",
	{
		_id: t.text("_id").primaryKey().notNull(),
		name: t.text("name").notNull(),
		unit_price: t.numeric("unit_price").notNull(),
		category: t.text("category", { enum: productsCategoriesValues }).default("others").notNull(),
		description: t.text("description").default("Sin descripción.").notNull(),
		disabled: t
			.text("disabled", { enum: ["true", "false"] })
			.default("false")
			.notNull(),
		created_at: t.text("created_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
		image_id: t.text("image_id").references(() => UserImagesTable._id),
		user_id: t
			.text("user_id")
			.references(() => UserTable._id)
			.notNull()
	},
	(table) => [t.index("name_products_idx").on(table.name)]
)

export type ProductsTableType = typeof ProductsTable.$inferInsert

export const UserImagesTable = table(
	"user_images",
	{
		_id: t.text("_id").primaryKey().notNull(),
		image_id: t
			.text("image_id")
			.references(() => ImagesTable._id)
			.notNull(),
		user_id: t
			.text("user_id")
			.references(() => UserTable._id)
			.notNull()
	},
	(table) => [t.index("user_id_idx").on(table.user_id)]
)

export type UserImagesTableType = typeof UserImagesTable.$inferInsert

export const ImagesTable = table("images", {
	_id: t.text("_id").primaryKey().notNull(),
	url: t.text("url").notNull()
})

export type ImagesTableType = typeof ImagesTable.$inferInsert

// kg: "Kilogramos",
// g: "Gramos",
// l: "Litros",
// ml: "Mililitros",
// units: "Unidades"
// export const StockTable = table(
// 	"stock",
// 	{
// 		_id: t.text("_id").primaryKey().notNull(),
// 		name: t.text("name").notNull(),
// 		quantity: t.numeric("quantity").notNull(),
// 		unit: t.text("unit", { enum: ["kg", "g", "l", "ml", "units"] }).notNull(),
// 		observation: t.text("observation"),
// 		updated_at: t.text("updated_at").default(sql`(CURRENT_TIMESTAMP)`).notNull()
// 	},
// 	(table) => [t.index("name_idx").on(table.name), t.index("unit_idx").on(table.unit)]
// )
