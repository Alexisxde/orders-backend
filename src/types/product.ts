import type { ProductsTableType as Product } from "../db/schema"

export type InsertProduct = Required<Pick<Product, "name" | "unit_price" | "description" | "image_id" | "user_id">>
