import type { Request, Response } from "express"
import { getProduct, getProducts, insertProduct } from "../models/product.model"
import { productCreateSchema } from "../schemas/product.schema"

export async function createProduct(req: Request, res: Response) {
	if (!req.body.user) return res.status(404).json({ success: false, error: "Ocurrió un error inesperado." })
	const { _id: user_id } = req.body.user
	const { success, error, data } = productCreateSchema.safeParse(req.body)

	if (!success)
		return res.status(400).json({ errors: error.errors.map((err) => ({ field: err.path[0], message: err.message })) })

	const { name, price, description, image_id } = data

	try {
		const result = await insertProduct({ name, unit_price: price.toString(), description, image_id, user_id })
		res.status(201).json({ result })
	} catch (_) {
		return []
	}
}

export async function selectProducts(req: Request, res: Response) {
	if (!req.body.user) return res.status(404).json({ success: false, error: "Ocurrió un error inesperado." })
	const { _id: user_id } = req.body.user

	try {
		const data = await getProducts(user_id)
		res.status(200).json({ success: true, data, error: null })
	} catch (_) {
		return []
	}
}

export async function selectIdProduct(req: Request<{ id: string }>, res: Response) {
	if (!req.body.user) return res.status(404).json({ success: false, error: "Ocurrió un error inesperado." })
	const {
		body: {
			user: { _id: user_id }
		},
		params: { id }
	} = req

	try {
		const data = await getProduct({ id, user_id })
		res.status(200).json({ success: true, data, error: null })
	} catch (_) {
		return []
	}
}
