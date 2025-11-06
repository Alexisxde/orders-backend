import type { Request, Response } from "express"
import { getProduct, getProducts, insertProduct } from "../models/product.model"

export async function createProduct(req: Request, res: Response) {
	if (!req.body.user) return res.status(401).json({ error: "Unauthorized" })
	const { _id: user_id } = req.body.user
	const { name, price, description, image_id } = req.body

	try {
		const result = await insertProduct({ name, unit_price: price.toString(), description, image_id, user_id })
		res.status(201).json({ result })
	} catch (_) {
		return []
	}
}

export async function selectProducts(req: Request, res: Response) {
	const { _id } = req.body.user

	try {
		const data = await getProducts(_id)
		res.status(200).json({ success: true, data, error: null })
	} catch (_) {
		return []
	}
}

export async function selectIdProduct(req: Request<{ id: string }>, res: Response) {
	if (!req.body.user) return res.status(401).json({ error: "Unauthorized" })
	const { _id: user_id } = req.body.user
	const { id } = req.params

	try {
		const data = await getProduct({ id, user_id })
		res.status(200).json({ success: true, data, error: null })
	} catch (_) {
		return []
	}
}
