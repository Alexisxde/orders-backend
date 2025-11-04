import { and, asc, desc, eq } from "drizzle-orm"
import db from "../db/db"
import { OrdersDetailsTable, OrdersTable } from "../db/schema"
import { getProduct } from "../models/product.model"
import type { InsertOrder, InsertOrderDetails, SelectOrders } from "../types/order"

export async function insertOrder({ name, phone, payment_method, user_id, orders }: InsertOrder) {
	if (!user_id || !orders?.length) return null

	const _id = crypto.randomUUID()
	let total = 0

	const orderDetailsData: InsertOrderDetails[] = []

	try {
		for (const order of orders) {
			if (!order.product_id) continue

			const product = await getProduct({ id: order.product_id, user_id })
			const price = product?.[0]?.price
			if (!price) continue

			const unit_price = Number(price)
			total += order.quantity * unit_price

			orderDetailsData.push({
				product_id: order.product_id,
				price: unit_price,
				quantity: order.quantity,
				observation: order.observation
			})
		}

		const [orderResult] = await db
			.insert(OrdersTable)
			.values({
				_id,
				payment_method,
				total: total.toString(),
				name,
				phone,
				user_id
			})
			.returning()

		const detailInserts = orderDetailsData.map(({ price, quantity, observation, product_id }) =>
			db.insert(OrdersDetailsTable).values({
				_id: crypto.randomUUID(),
				quantity: quantity.toString(),
				price: price.toString(),
				observation,
				product_id,
				order_id: orderResult._id
			})
		)
		await Promise.all(detailInserts)
		return { orderResult, details: orderDetailsData }
	} catch (_) {
		return []
	}
}

export async function selectOrders({
	page = 1,
	per_page = 15,
	status,
	// from,
	// to,
	sort_by = "created_at",
	sort_order = "desc"
}: SelectOrders) {
	try {
		const conditions = []
		const offset = (page - 1) * per_page

		if (status && status !== "all") conditions.push(eq(OrdersTable.status, status))
		// if (from) conditions.push(gte(OrdersTable.created_at, new Date(from)))
		// if (to) conditions.push(lte(OrdersTable.created_at, new Date(to)))

		const result = await db
			.select()
			.from(OrdersTable)
			.leftJoin(OrdersDetailsTable, eq(OrdersTable._id, OrdersDetailsTable._id))
			.where(and(...conditions))
			.orderBy(sort_order === "asc" ? asc(OrdersTable[sort_by]) : desc(OrdersTable[sort_by]))
			.limit(per_page)
			.offset(offset)

		return result
	} catch (_) {
		return []
	}
}
