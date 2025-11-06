import { and, asc, desc, eq } from "drizzle-orm"
import db from "../db/db"
import { OrdersDetailsTable, OrdersTable } from "../db/schema"
import { getProduct } from "../models/product.model"
import type { InsertOrder, InsertOrderDetails, SelectOrders } from "../types/order"

export async function insertOrder({ name, phone, payment_method, user_id, orders }: InsertOrder) {
	let total = 0
	const _id = crypto.randomUUID()
	const orderDetailsData: InsertOrderDetails[] = []

	try {
		for (const order of orders) {
			if (!order.product_id) continue

			const product = await getProduct({ id: order.product_id, user_id })
			const price = product?.price
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

		const [result] = await db
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
				order_id: result._id
			})
		)
		await Promise.all(detailInserts)
		return { result, details: orderDetailsData }
	} catch (_) {
		throw {
			status: 500,
			message: "No se pudo guardar la información en la base de datos. Intente nuevamente más tarde."
		}
	}
}

export async function selectOrders({
	page = "1",
	per_page = "15",
	status = "all",
	// from,
	// to,
	sort_by = "created_at",
	sort_order = "desc",
	user_id
}: SelectOrders) {
	const conditions = []
	const page_number = parseInt(page, 2)
	const per_page_number = parseInt(per_page, 2)
	const offset = (page_number - 1) * per_page_number
	if (!Number.isFinite(page_number) || page_number <= 0 || !Number.isFinite(per_page_number) || per_page_number <= 0) {
		throw { status: 400, message: "Los parámetros de paginación no son válidos." }
	}

	try {
		if (status !== "all") conditions.push(eq(OrdersTable.status, status))
		// if (from) conditions.push(gte(OrdersTable.created_at, new Date(from)))
		// if (to) conditions.push(lte(OrdersTable.created_at, new Date(to)))

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
			.limit(page_number)
			.offset(offset)

		return { result, per_page: per_page_number, page: page_number }
	} catch (_) {
		throw {
			status: 500,
			message: "No se pudo obtener la información desde la base de datos. Intente nuevamente más tarde."
		}
	}
}
