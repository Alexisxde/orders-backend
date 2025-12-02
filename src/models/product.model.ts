import { and, eq } from "drizzle-orm"
import db from "../db/db"
import { ImagesTable, ProductsTable, UserImagesTable } from "../db/schema"
import type { InsertProduct } from "../types/product"

export async function insertProduct({
	name,
	unit_price,
	description = "Sin observaciones",
	image_id = null,
	user_id
}: InsertProduct) {
	const _id = crypto.randomUUID()
	try {
		const [result] = await db
			.insert(ProductsTable)
			.values({ _id, name, unit_price, description, image_id, user_id })
			.returning({
				_id: ProductsTable._id,
				name: ProductsTable.name,
				price: ProductsTable.unit_price,
				description: ProductsTable.description,
				disabled: ProductsTable.disabled
			})

		return { ...result, disabled: result.disabled === "true" }
	} catch (_) {
		throw {
			status: 500,
			error: "No se pudo guardar la información en la base de datos. Intente nuevamente más tarde."
		}
	}
}

export async function getProducts(user_id: string) {
	try {
		const result = await db
			.select({
				_id: ProductsTable._id,
				name: ProductsTable.name,
				price: ProductsTable.unit_price,
				disabled: ProductsTable.disabled,
				description: ProductsTable.description,
				image: ImagesTable.url
			})
			.from(ProductsTable)
			.where(eq(ProductsTable.user_id, user_id))
			.leftJoin(UserImagesTable, eq(UserImagesTable._id, ProductsTable.image_id))
			.leftJoin(ImagesTable, eq(ImagesTable._id, UserImagesTable.image_id))
		return result.map((product) => ({ ...product, disabled: product.disabled === "true" }))
	} catch (_) {
		throw { status: 500, error: "No se pudo obtener la información de los productos. Intente nuevamente más tarde." }
	}
}

export async function getProduct({ id, user_id }: { id: string; user_id: string }) {
	try {
		const [result] = await db
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
	} catch (_) {
		throw { status: 500, error: "No se pudo obtener la información del producto. Intente nuevamente más tarde." }
	}
}

export default { insert: insertProduct, get: getProducts, getById: getProduct }
