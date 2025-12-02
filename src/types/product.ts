import type { ProductsTableType as Product } from "../db/schema"

export const productsCategoriesValues = ["pizza", "burguer", "others"] as const
export type ProductsCategories = (typeof productsCategoriesValues)[number]

export type InsertProduct = Required<
	Pick<Product, "name" | "unit_price" | "category" | "description" | "image_id" | "user_id">
>
