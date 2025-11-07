import type { OrdersDetailsTableType, OrdersTableType } from "../db/schema"

// cash: "Efectivo", transfer: "Transferencia", mercado_pago: "Mercado Pago",
export const orderPaymentMethodValues = ["cash", "transfer", "mercado_pago"] as const
// on_hold: "En espera", delivered: "Entregado", cancelled: "Cancelado", deleted: "Eliminado"
export const orderStatusValues = ["delivered", "on_hold", "deleted", "cancelled"] as const
export const orderSortByValues = ["created_at", "total", "status"] as const

export type Order = OrdersTableType
export type OrderDetails = OrdersDetailsTableType
export type OrderId = Order["_id"]
export type OrderPaymentMethod = (typeof orderPaymentMethodValues)[number]
export type OrderStatus = (typeof orderStatusValues)[number]
export type OrderSortBy = (typeof orderSortByValues)[number]
export type OrderSort = "asc" | "desc"

export type InsertOrderDetails = {
	product_id: string
	quantity: number
	price: number
	observation?: string
}

export type InsertOrder = {
	name: string
	phone?: string | null
	payment_method: OrderPaymentMethod
	user_id: string
	orders: Omit<InsertOrderDetails, "price">[]
}

export type SelectOrders = {
	page?: string
	per_page?: string
	from?: string
	to?: string
	status?: OrderStatus
	sort_by?: OrderSortBy
	sort_order?: OrderSort
	user_id: string
}
