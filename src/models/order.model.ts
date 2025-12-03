import { and, asc, count, desc, eq, gte, lte, sql } from "drizzle-orm"
import db from "../db/db"
import { OrdersDetailsTable, OrdersTable, ProductsTable } from "../db/schema"
import { getProduct } from "../models/product.model"
import type { CreateOrder, CreateOrderDetails, OrderStatus, SelectOrders } from "../types/order"
import { orderStatusValues } from "../types/order"

export async function createOrder(order: CreateOrder) {
	const _id = crypto.randomUUID()
	const { name, phone, payment_method, user_id, orders } = order
	const orderDetailsData: CreateOrderDetails[] = []
	let total = 0

	for (const order of orders) {
		if (!order.product_id) continue
		const product = await getProduct({ id: order.product_id, user_id })
		const price = product?.price
		if (!price) continue

		const unit_price = Number(price)
		total += order.quantity * unit_price

		orderDetailsData.push({
			product_id: order.product_id,
			price: unit_price.toString(),
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
}

export async function selectOrders({ user_id, ...options }: SelectOrders) {
	const { page = "1", per_page = "15", status, from, to, sort_by = "created_at", sort_order = "desc" } = options
	const conditions = [eq(OrdersTable.user_id, user_id)]
	const page_number = parseInt(page)
	const limit = parseInt(per_page)
	const offset = (page_number - 1) * limit
	if (!Number.isFinite(page_number) || page_number <= 0)
		throw { status: 400, error: [{ param: "page", message: "Tiene que ser un número." }] }

	if (!Number.isFinite(limit) || limit <= 0)
		throw { status: 400, error: [{ param: "limit", message: "Tiene que ser un número." }] }

	if (status && orderStatusValues.includes(status)) conditions.push(eq(OrdersTable.status, status))
	if (from && to) {
		const targetFromDate = new Date(from)
		const startOfDay = new Date(targetFromDate)
		startOfDay.setHours(0, 0, 0, 0)

		const targetToDate = new Date(to)
		const endOfDay = new Date(targetToDate)
		endOfDay.setHours(23, 59, 59, 999)

		conditions.push(gte(OrdersTable.created_at, startOfDay.toISOString()))
		conditions.push(lte(OrdersTable.created_at, endOfDay.toISOString()))
	}

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
		.leftJoin(OrdersDetailsTable, eq(OrdersTable._id, OrdersDetailsTable.order_id))
		.where(and(...conditions))
		.orderBy(sort_order === "asc" ? asc(OrdersTable[sort_by]) : desc(OrdersTable[sort_by]))
		.limit(limit)
		.offset(offset)

	const [total] = await db
		.select({ count: count() })
		.from(OrdersTable)
		.where(and(...conditions))
	const pages = Math.ceil(total.count / limit)

	return { page: page_number, pages, result }
}

export async function selectOrders6Month({ status = "delivered", user_id }: { status: OrderStatus; user_id: string }) {
	const result = await db
		.select({
			month: sql`strftime('%m', ${OrdersTable.created_at})`.as("month"),
			status: OrdersTable.status,
			total: sql`SUM(${OrdersDetailsTable.price} * ${OrdersDetailsTable.quantity})`.as("total"),
			quantity: sql`SUM(${OrdersDetailsTable.quantity})`.as("quantity")
		})
		.from(OrdersTable)
		.leftJoin(OrdersDetailsTable, eq(OrdersTable._id, OrdersDetailsTable.order_id))
		.where(
			and(
				eq(OrdersTable.user_id, user_id),
				gte(OrdersTable.created_at, sql`datetime('now', '-6 months')`),
				eq(OrdersTable.status, status)
			)
		)
		.groupBy(sql`strftime('%m', ${OrdersTable.created_at})`)
		.orderBy(sql`strftime('%m', ${OrdersTable.created_at})`)

	return result
}

export async function selectOrdersToDay({
	date,
	status = "delivered",
	user_id
}: {
	date: string
	status: OrderStatus
	user_id: string
}) {
	const [result] = await db
		.select({
			date: sql`strftime('%Y-%m-%d', ${OrdersTable.created_at})`.as("date"),
			status: OrdersTable.status,
			total: sql`SUM(${OrdersDetailsTable.price} * ${OrdersDetailsTable.quantity})`.as("total"),
			quantity: sql`SUM(${OrdersDetailsTable.quantity})`.as("quantity")
		})
		.from(OrdersTable)
		.leftJoin(OrdersDetailsTable, eq(OrdersTable._id, OrdersDetailsTable.order_id))
		.where(
			and(
				eq(OrdersTable.user_id, user_id),
				eq(sql`strftime('%Y-%m-%d', ${OrdersTable.created_at})`, date),
				eq(OrdersTable.status, status)
			)
		)
		.groupBy(sql`strftime('%m-%d', ${OrdersTable.created_at})`)
		.orderBy(sql`strftime('%m-%d', ${OrdersTable.created_at})`)

	return { date, status, total: result?.total ?? 0, quantity: result?.quantity ?? 0 }
}

export async function selectOrdersTopClients({ user_id }: { user_id: string }) {
	const result = await db
		.select({
			client: OrdersTable.name,
			total: sql`SUM(${OrdersTable.total})`.as("total"),
			quantity: sql`SUM(${OrdersDetailsTable.quantity})`.as("quantity")
		})
		.from(OrdersTable)
		.leftJoin(OrdersDetailsTable, eq(OrdersTable._id, OrdersDetailsTable.order_id))
		.where(and(eq(OrdersTable.user_id, user_id), eq(OrdersTable.status, "delivered")))
		.groupBy(OrdersTable.name)
		.orderBy(desc(OrdersTable.total))
		.limit(10)

	return result
}

export async function selectOrdersTopProducts({ user_id }: { user_id: string }) {
	const result = await db
		.select({
			product_name: ProductsTable.name,
			quantity: sql`SUM(${OrdersDetailsTable.quantity})`.as("quantity")
		})
		.from(OrdersTable)
		.leftJoin(OrdersDetailsTable, eq(OrdersTable._id, OrdersDetailsTable.order_id))
		.leftJoin(ProductsTable, eq(OrdersDetailsTable.product_id, ProductsTable._id))
		.where(
			and(
				eq(OrdersTable.user_id, user_id),
				eq(OrdersTable.status, "delivered"),
				eq(OrdersDetailsTable.product_id, ProductsTable._id)
			)
		)
		.groupBy(OrdersDetailsTable.product_id, ProductsTable.name)
		.orderBy(desc(sql`SUM(${OrdersDetailsTable.quantity})`))
		.limit(5)

	return result
}

export async function selectOrdersToMonth({
	status = "delivered",
	month,
	year = "2025",
	user_id
}: {
	status: OrderStatus
	month: string
	year: string
	user_id: string
}) {
	const [result] = await db
		.select({
			month: sql`strftime('%m', ${OrdersTable.created_at})`.as("month"),
			status: OrdersTable.status,
			total: sql`SUM(${OrdersDetailsTable.price} * ${OrdersDetailsTable.quantity})`.as("total"),
			quantity: sql`SUM(${OrdersDetailsTable.quantity})`.as("quantity")
		})
		.from(OrdersTable)
		.leftJoin(OrdersDetailsTable, eq(OrdersTable._id, OrdersDetailsTable.order_id))
		.where(
			and(
				eq(OrdersTable.user_id, user_id),
				eq(sql`strftime('%m', ${OrdersTable.created_at})`, month),
				eq(sql`strftime('%Y', ${OrdersTable.created_at})`, year),
				eq(OrdersTable.status, status)
			)
		)
		.groupBy(sql`strftime('%m', ${OrdersTable.created_at})`)
		.orderBy(sql`strftime('%m', ${OrdersTable.created_at})`)

	return { month, total: result?.total ?? 0, quantity: result?.quantity ?? 0, year }
}

export default { select: selectOrders, create: createOrder, update: null }
