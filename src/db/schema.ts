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

// delivered: "Entregado"
// to_ship: "Listo para enviar",
// pickup: "Listo para recoger",
// on_hold: "En espera",
// deleted: "Eliminado"
// cancelled: "Cancelado"

// cash: "Efectivo",
// card: "Tarjeta",
// transfer: "Transferencia",
// mercado_pago: "Mercado Pago",
// qr: "Código QR"
export const OrdersTable = table(
	"orders",
	{
		_id: t.text("_id").primaryKey().notNull(),
		payment_method: t.text("payment_method", { enum: ["cash", "card", "transfer", "mercado_pago", "qr"] }).notNull(),
		status: t
			.text("status", { enum: ["delivered", "to_ship", "pickup", "on_hold", "deleted", "cancelled"] })
			.default("on_hold"),
		total: t.numeric("total").notNull(),
		created_at: t.text("created_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
		client_id: t.text("client_id").references(() => ClientsTable._id)
	},
	(table) => [t.index("status_idx").on(table.status), t.index("payment_method_idx").on(table.payment_method)]
)

export const OrdersDetailsTable = table(
	"orders_details",
	{
		_id: t.text("_id").primaryKey().notNull(),
		quality: t.numeric("quality").notNull(),
		unit_price: t.numeric("unit_price").notNull(),
		observation: t.text("observation"),
		order_id: t.text("order_id").references(() => OrdersTable._id),
		product_id: t.text("product_id").references(() => ProductsTable._id)
	},
	(table) => [t.index("order_idx").on(table.order_id)]
)

export const ProductsTable = table(
	"products",
	{
		_id: t.text("_id").primaryKey().notNull(),
		name: t.text("name").notNull(),
		price: t.numeric("unit_price").notNull(),
		description: t.text("description"),
		image_id: t.text("image_id").references(() => ImagesTable._id)
	},
	(table) => [t.index("name_idx").on(table.name)]
)

export const ImagesTable = table(
	"images",
	{
		_id: t.text("_id").primaryKey().notNull(),
		name: t.text("name").notNull(),
		url: t.text("url").notNull(),
		description: t.text("description")
	},
	(table) => [t.index("name_idx").on(table.name)]
)
