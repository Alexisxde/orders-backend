import type { OrdersTableType as Order, OrdersDetailsTableType as OrderDetails } from "../db/schema"
// cash: "Efectivo", transfer: "Transferencia", mercado_pago: "Mercado Pago",
// on_hold: "En espera", delivered: "Entregado", cancelled: "Cancelado", deleted: "Eliminado"
export const orderPaymentMethodValues = ["cash", "transfer", "mercado_pago"] as const
export const orderStatusValues = ["delivered", "on_hold", "deleted", "cancelled"] as const
export const orderSortByValues = ["created_at", "total", "status"] as const
export type OrderPaymentMethod = (typeof orderPaymentMethodValues)[number]
export type OrderStatus = (typeof orderStatusValues)[number]
export type OrderSortBy = (typeof orderSortByValues)[number]
export type OrderSort = "asc" | "desc"

export type InsertOrder = Required<Pick<Order, "name" | "phone" | "payment_method" | "user_id">>
export type InsertOrderDetails = Required<Pick<OrderDetails, "product_id" | "quantity" | "price" | "observation">>
export type SelectOrders = Required<Pick<Order, "user_id">> & {
	page?: string
	per_page?: string
	from?: string
	to?: string
	status?: OrderStatus
	sort_by?: OrderSortBy
	sort_order?: OrderSort
}
