import { and, eq } from "drizzle-orm"
import db from "../db/db"
import { ImagesTable, ProductsTable, UserImagesTable } from "../db/schema"
import type { InsertProduct } from "../types/product"

export async function insertProduct({ name, unit_price, description, image_id, user_id }: InsertProduct) {
	const _id = crypto.randomUUID()
	try {
		const result = await db
			.insert(ProductsTable)
			.values({ _id, name, unit_price, description, image_id, user_id })
			.returning()
		return result[0]
	} catch (_) {
		return []
	}
}

export async function getProducts(user_id: string) {
	try {
		const result = await db
			.select({
				_id: ProductsTable._id,
				name: ProductsTable.name,
				price: ProductsTable.unit_price,
				description: ProductsTable.description,
				image: ImagesTable.url
			})
			.from(ProductsTable)
			.where(eq(ProductsTable.user_id, user_id))
			.leftJoin(UserImagesTable, eq(UserImagesTable._id, ProductsTable.image_id))
			.leftJoin(ImagesTable, eq(ImagesTable._id, UserImagesTable.image_id))
		return result
	} catch (_) {}
}

export async function getProduct({ id, user_id }: { id: string; user_id: string }) {
	try {
		const result = await db
			.select({
				_id: ProductsTable._id,
				name: ProductsTable.name,
				price: ProductsTable.unit_price,
				description: ProductsTable.description,
				image: ImagesTable.url
			})
			.from(ProductsTable)
			.where(and(eq(ProductsTable.user_id, user_id), eq(ProductsTable._id, id)))
			.leftJoin(UserImagesTable, eq(UserImagesTable._id, ProductsTable.image_id))
			.leftJoin(ImagesTable, eq(ImagesTable._id, UserImagesTable.image_id))
		return result
	} catch (_) {}
}
