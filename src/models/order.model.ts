// import { and, asc, desc, eq } from "drizzle-orm"
// import db from "../db/db"
// import { OrdersDetailsTable, OrdersTable } from "../db/schema"
// import type { InsertOrder, SelectOrders } from "../types/order"

// export async function insertOrder({ name, phone, payment_method, status, total, user_id, orders }: InsertOrder) {
// 	const _id = crypto.randomUUID()
// 	try {
// 		const order = await db.insert(OrdersTable).values({ _id, payment_method, status, name, phone, total, user_id })
// 		const order_details = orders.map(
// 			async ({ quality, unit_price, product_id, observation }) =>
// 				await db.insert(OrdersDetailsTable).values({
// 					_id: crypto.randomUUID(),
// 					order_id: _id,
// 					product_id,
// 					quality,
// 					unit_price,
// 					observation
// 				})
// 		)
// 	} catch (_) {
// 		return []
// 	}
// }

// export async function selectOrders({
// 	page = 1,
// 	per_page = 15,
// 	status,
// 	// from,
// 	// to,
// 	sort_by = "created_at",
// 	sort_order = "desc"
// }: SelectOrders) {
// 	try {
// 		const conditions = []
// 		const offset = (page - 1) * per_page

// 		if (status && status !== "all") conditions.push(eq(OrdersTable.status, status))
// 		// if (from) conditions.push(gte(OrdersTable.created_at, new Date(from)))
// 		// if (to) conditions.push(lte(OrdersTable.created_at, new Date(to)))

// 		const result = await db
// 			.select()
// 			.from(OrdersTable)
// 			.leftJoin(OrdersDetailsTable, eq(OrdersTable._id, OrdersDetailsTable._id))
// 			.where(and(...conditions))
// 			.orderBy(sort_order === "asc" ? asc(OrdersTable[sort_by]) : desc(OrdersTable[sort_by]))
// 			.limit(per_page)
// 			.offset(offset)

// 		return result
// 	} catch (_) {
// 		return []
// 	}
// }
