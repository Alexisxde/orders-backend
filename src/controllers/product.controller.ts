import type { Request, Response } from "express"
import { getProduct, getProducts, insertProduct } from "../models/product.model"
import type { UserJWT } from "../types/auth"
import type { HttpError } from "../types/error"

export async function createProduct(req: Request, res: Response) {
	const { _id: user_id } = req.body.user as UserJWT
	const { name, price, description, image_id } = req.body

	try {
		const data = await insertProduct({ name, unit_price: price.toString(), description, image_id, user_id })
		res.status(201).json({ success: true, data, error: null })
	} catch (e: unknown) {
		const err = e as HttpError
		res.status(err?.status || 500).json({ success: false, error: err?.message || "Internal Server Error" })
	}
}

export async function selectProducts(req: Request, res: Response) {
	const { _id: user_id } = req.body.user as UserJWT

	try {
		const data = await getProducts(user_id)
		res.status(200).json({ success: true, data, error: null })
	} catch (e: unknown) {
		const err = e as HttpError
		res.status(err?.status || 500).json({ success: false, error: err?.message || "Internal Server Error" })
	}
}

export async function selectIdProduct(req: Request<{ id: string }>, res: Response) {
	const { _id: user_id } = req.body.user as UserJWT
	const { id } = req.params

	try {
		const data = await getProduct({ id, user_id })
		res.status(200).json({ success: true, data, error: null })
	} catch (e: unknown) {
		const err = e as HttpError
		res.status(err?.status || 500).json({ success: false, error: err?.message || "Internal Server Error" })
	}
}
