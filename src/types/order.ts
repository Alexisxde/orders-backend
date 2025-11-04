import type { OrdersTableType as Order } from "../db/schema"

// cash: "Efectivo", transfer: "Transferencia", mercado_pago: "Mercado Pago",
export const orderPaymentMethodValues = ["cash", "transfer", "mercado_pago"] as const
// on_hold: "En espera", delivered: "Entregado", cancelled: "Cancelado", deleted: "Eliminado"
export const orderStatusValues = ["delivered", "on_hold", "deleted", "cancelled"] as const

export type OrderId = Order["_id"]
export type OrderPaymentMethod = (typeof orderPaymentMethodValues)[number]
export type OrderStatus = (typeof orderStatusValues)[number]

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
	status: "all" | OrderStatus
	from: string | undefined
	to: string | undefined
	sort_by?: "created_at" | "total" | "status"
	sort_order?: "asc" | "desc"
	page?: number
	per_page?: number
}
