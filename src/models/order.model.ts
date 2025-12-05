import { and, asc, count, desc, eq, gte, lte, sql } from "drizzle-orm"
import db from "../db/db"
import { OrdersDetailsTable, OrdersTable, ProductsTable } from "../db/schema"
import { getProduct } from "../models/product.model"
import type { CreateOrder, CreateOrderDetails, OrderPaymentMethod, OrderStatus, SelectOrders } from "../types/order"

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

export async function getOrderAndDetails({ _id, user_id }: { _id: string; user_id: string }) {
	const result = await db
		.select({
			_id: OrdersTable._id,
			name: OrdersTable.name,
			phone: OrdersTable.phone,
			payment_method: OrdersTable.payment_method,
			total: OrdersTable.total,
			status: OrdersTable.status,
			created_at: OrdersTable.created_at,
			detail_id: OrdersDetailsTable._id,
			quantity: OrdersDetailsTable.quantity,
			price: OrdersDetailsTable.price,
			observation: OrdersDetailsTable.observation,
			product_id: ProductsTable._id,
			product_name: ProductsTable.name,
			product_category: ProductsTable.category,
			product_description: ProductsTable.description
		})
		.from(OrdersTable)
		.leftJoin(OrdersDetailsTable, eq(OrdersTable._id, OrdersDetailsTable.order_id))
		.leftJoin(ProductsTable, eq(OrdersDetailsTable.product_id, ProductsTable._id))
		.where(and(eq(OrdersTable._id, _id), eq(OrdersTable.user_id, user_id)))

	if (!result || result.length === 0) throw { status: 404, error: "No se encontró ese pedido." }

	const order = {
		_id: result[0]._id,
		name: result[0].name,
		phone: result[0].phone,
		payment_method: result[0].payment_method,
		total: result[0].total,
		status: result[0].status,
		created_at: result[0].created_at,
		details: result.map((row) => ({
			quantity: row.quantity,
			price: row.price,
			observation: row.observation,
			product: {
				_id: row.product_id,
				name: row.product_name,
				category: row.product_category,
				description: row.product_description
			}
		}))
	}

	return order
}

export async function selectOrders({ user_id, ...options }: SelectOrders) {
	const {
		page = "1",
		per_page = "15",
		status = "delivered",
		from,
		to,
		sort_by = "created_at",
		sort_order = "desc"
	} = options
	const conditions = [eq(OrdersTable.user_id, user_id), eq(OrdersTable.status, status)]
	const page_number = parseInt(page)
	const limit = parseInt(per_page)
	const offset = (page_number - 1) * limit
	if (!Number.isFinite(page_number) || page_number <= 0)
		throw { status: 400, error: [{ param: "page", message: "Tiene que ser un número." }] }

	if (!Number.isFinite(limit) || limit <= 0)
		throw { status: 400, error: [{ param: "limit", message: "Tiene que ser un número." }] }

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

export async function updateOrder({
	_id,
	user_id,
	...options
}: {
	_id: string
	name?: string
	status?: OrderStatus
	payment_method?: OrderPaymentMethod
	phone?: string
	user_id: string
}) {
	const { name, phone, status, payment_method } = options

	if (!name && !phone && !status && !payment_method)
		throw {
			status: 400,
			error: "Para actualizar se necesitan algunos de estos campos. (name, phone, status, payment_method)"
		}

	const orderExists = await getOrderAndDetails({ _id, user_id })
	if (!orderExists) throw { status: 404, error: "El pedido no pudo ser encontrado." }

	const [result] = await db
		.update(OrdersTable)
		.set({ name, phone, payment_method, status })
		.where(and(eq(OrdersTable._id, _id), eq(OrdersTable.user_id, user_id)))
		.returning({
			_id: OrdersTable._id,
			name: OrdersTable.name,
			phone: OrdersTable.phone,
			payment_method: OrdersTable.payment_method,
			total: OrdersTable.total,
			created_at: OrdersTable.created_at,
			status: OrdersTable.status
		})

	return result
}

export default {
	select: selectOrders,
	create: createOrder,
	getOrderAndDetails,
	selectOne: getOrderAndDetails,
	update: updateOrder
}
