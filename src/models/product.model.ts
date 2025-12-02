import { and, eq } from "drizzle-orm"
import db from "../db/db"
import { ImagesTable, ProductsTable, UserImagesTable } from "../db/schema"
import type { HttpError } from "../types/error"
import type { InsertProduct, ProductsCategories } from "../types/product"

export async function insertProduct({
	name,
	unit_price,
	category,
	description = "Sin observaciones",
	image_id = null,
	user_id
}: InsertProduct) {
	const _id = crypto.randomUUID()
	try {
		const [result] = await db
			.insert(ProductsTable)
			.values({ _id, name, unit_price, category, description, image_id, user_id })
			.returning({
				_id: ProductsTable._id,
				name: ProductsTable.name,
				price: ProductsTable.unit_price,
				category: ProductsTable.category,
				description: ProductsTable.description,
				disabled: ProductsTable.disabled
			})

		return { ...result, disabled: result.disabled === "true" }
	} catch (e: unknown) {
		const err = e as HttpError
		throw {
			status: err?.status || 500,
			error: err?.error || "No se pudo guardar la información en la base de datos. Intente nuevamente más tarde."
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
				category: ProductsTable.category,
				disabled: ProductsTable.disabled,
				description: ProductsTable.description,
				image: ImagesTable.url
			})
			.from(ProductsTable)
			.where(eq(ProductsTable.user_id, user_id))
			.leftJoin(UserImagesTable, eq(UserImagesTable._id, ProductsTable.image_id))
			.leftJoin(ImagesTable, eq(ImagesTable._id, UserImagesTable.image_id))

		return result.map((product) => ({ ...product, disabled: product.disabled === "true" }))
	} catch (e: unknown) {
		const err = e as HttpError
		throw {
			status: err?.status || 500,
			error: err?.error || "No se pudo obtener la información de los productos. Intente nuevamente más tarde."
		}
	}
}

export async function getProduct({ id, user_id }: { id: string; user_id: string }) {
	try {
		const [result] = await db
			.select({
				_id: ProductsTable._id,
				name: ProductsTable.name,
				price: ProductsTable.unit_price,
				category: ProductsTable.category,
				description: ProductsTable.description,
				disabled: ProductsTable.disabled,
				image: ImagesTable.url
			})
			.from(ProductsTable)
			.where(and(eq(ProductsTable.user_id, user_id), eq(ProductsTable._id, id)))
			.leftJoin(UserImagesTable, eq(UserImagesTable._id, ProductsTable.image_id))
			.leftJoin(ImagesTable, eq(ImagesTable._id, UserImagesTable.image_id))

		if (!result) throw { status: 404, error: "El producto no pudo ser encontrado." }

		return { ...result, disabled: result.disabled === "true" }
	} catch (e: unknown) {
		const err = e as HttpError
		throw {
			status: err?.status || 500,
			error: err?.error || "No se pudo obtener la información del producto. Intente nuevamente más tarde."
		}
	}
}

export async function update({
	_id,
	name,
	description,
	unit_price,
	category,
	disabled,
	user_id
}: {
	_id: string
	name?: string
	description?: string
	unit_price?: string
	category?: ProductsCategories
	disabled?: "true" | "false"
	user_id: string
}) {
	try {
		const product = await getProduct({ id: _id, user_id })
		if (!product) throw { status: 404, error: "El producto no pudo ser encontrado." }

		const [result] = await db
			.update(ProductsTable)
			.set({ name, description, unit_price, category, disabled })
			.where(and(eq(ProductsTable._id, _id), eq(ProductsTable.user_id, user_id)))
			.returning({
				name: ProductsTable.name,
				price: ProductsTable.unit_price,
				category: ProductsTable.category,
				description: ProductsTable.description,
				disabled: ProductsTable.disabled
			})

		return { ...result, disabled: result.disabled === "true" }
	} catch (e: unknown) {
		const err = e as HttpError
		throw {
			status: err?.status || 500,
			error: err?.error || "No se pudo actualizar la información del producto. Intente nuevamente más tarde."
		}
	}
}

export default { insert: insertProduct, get: getProducts, getById: getProduct, update }
