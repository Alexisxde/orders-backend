import { and, eq } from "drizzle-orm"
import db from "../db/db"
import { ImagesTable, ProductsTable, UserImagesTable } from "../db/schema"
import type { CreateProduct, UpdateProduct } from "../types/product"

export async function createProduct(product: CreateProduct) {
	const _id = crypto.randomUUID()
	const { name, unit_price, category, description, image_id = null, user_id } = product

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
}

export async function getProducts(user_id: string) {
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
}

export async function getProduct({ id, user_id }: { id: string; user_id: string }) {
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
}

export async function update(product: UpdateProduct) {
	const { _id, name, description, unit_price, category, disabled, user_id } = product
	if (!name && !category && !unit_price && !description && !disabled)
		throw {
			status: 400,
			error: "Para actualizar se necesitan algunos de estos campos. (name, category, price, description, disabled)"
		}

	const productExists = await getProduct({ id: _id, user_id })
	if (!productExists) throw { status: 404, error: "El producto no pudo ser encontrado." }

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
}

export default { create: createProduct, get: getProducts, getById: getProduct, update }
