import type { ProductsTableType as Product } from "../db/schema"

export type ProductId = Product["_id"]
export type InsertProduct = Omit<Product, "_id" | "created_at">
