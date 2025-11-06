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
				price: price.toString(),
				quantity,
				observation,
				product_id,
				order_id: orderResult._id
			})
		)
		await Promise.all(detailInserts)
		return { orderResult, details: orderDetailsData }
	} catch (_) {
		throw { status: 500, error: { message: "Server Internal Error" } }
	}
}

export async function selectOrders({
	page = 1,
	per_page = 15,
	status = "all",
	from,
	to,
	sort_by = "created_at",
	sort_order = "desc",
	user_id
}: SelectOrders) {
	try {
		const conditions = []
		const offset = (page - 1) * per_page

		if (status !== "all") conditions.push(eq(OrdersTable.status, status))
		// if (from) conditions.push(gte(OrdersTable.created_at, new Date(from)))
		// if (to) conditions.push(lte(OrdersTable.created_at, new Date(to)))
		console.log("from", from, "to", to)

		const result = await db
			.select({
				_id: OrdersTable._id,
				name: OrdersTable.name,
				phone: OrdersTable.phone,
				payment_method: OrdersTable.payment_method,
				total: OrdersTable.total,
				created_at: OrdersTable.created_at,
				status: OrdersTable.status
			})
			.from(OrdersTable)
			.leftJoin(OrdersDetailsTable, eq(OrdersTable._id, OrdersDetailsTable._id))
			.where(and(...conditions, eq(OrdersTable.user_id, user_id)))
			.orderBy(sort_order === "asc" ? asc(OrdersTable[sort_by]) : desc(OrdersTable[sort_by]))
			.limit(per_page)
			.offset(offset)

		return result
	} catch (_) {
		return []
	}
}
