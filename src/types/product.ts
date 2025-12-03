import type { ProductsTableType as Product } from "../db/schema"

export const productsCategoriesValues = ["pizza", "burguer", "others"] as const
export type ProductsCategories = (typeof productsCategoriesValues)[number]

export type CreateProduct = Required<
	Pick<Product, "name" | "unit_price" | "category" | "description" | "image_id" | "user_id">
>

export type UpdateProduct = Partial<Pick<Product, "name" | "unit_price" | "category" | "description" | "disabled">> &
	Required<Pick<Product, "_id" | "user_id">>
