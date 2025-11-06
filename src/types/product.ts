import type { ProductsTableType } from "../db/schema"

export type Product = ProductsTableType
export type ProductId = Product["_id"]

export type InsertProduct = {
	name: string
	user_id: string
	unit_price: string
	description?: string | null
	image_id: string
}
