import type { Request, Response } from "express"
import type { z } from "zod"
import ProductModel from "../models/product.model"
import type ProductShema from "../schemas/product.schema"
import type { UserJWT } from "../types/auth"
import type { HttpError } from "../types/error"
import ImageController from "./image.controller"

export async function createProduct(req: Request, res: Response) {
	const { _id: user_id } = req.body.user as UserJWT
	const { name, price, category, description } = req.body as z.infer<typeof ProductShema.create>
	const file = req.file

	try {
		if (!file) throw { status: 400, error: [{ field: "file", message: "La imagen del producto es obligatorio." }] }
		const { _id: image_id } = await ImageController.insert({ file, user_id })
		const data = await ProductModel.create({
			name,
			unit_price: price.toString(),
			category,
			description,
			image_id,
			user_id
		})
		res.status(201).json({ success: true, data, error: null })
	} catch (e: unknown) {
		const err = e as HttpError
		res.status(err?.status || 500).json({ success: false, error: err?.error || "Internal Server Error" })
	}
}

export async function selectProducts(req: Request, res: Response) {
	const { _id: user_id } = req.body.user as UserJWT

	try {
		const data = await ProductModel.get(user_id)
		res.status(200).json({ success: true, data, error: null })
	} catch (e: unknown) {
		const err = e as HttpError
		res.status(err?.status || 500).json({ success: false, error: err?.error || "Internal Server Error" })
	}
}

export async function selectIdProduct(req: Request, res: Response) {
	const { _id: user_id } = req.body.user as UserJWT
	const { id } = req.params as { id: string }

	try {
		const data = await ProductModel.getById({ id, user_id })
		res.status(200).json({ success: true, data, error: null })
	} catch (e: unknown) {
		const err = e as HttpError
		res.status(err?.status || 500).json({ success: false, error: err?.error || "Internal Server Error" })
	}
}

export async function updateProduct(req: Request, res: Response) {
	const { _id: user_id } = req.body.user as UserJWT
	const { id } = req.params as { id: string }
	const { name, category, price, description, disabled } = req.body as z.infer<typeof ProductShema.update>

	try {
		const data = await ProductModel.update({
			_id: id,
			name,
			category,
			unit_price: price?.toString(),
			description,
			disabled: disabled?.toString() as "true" | "false" | undefined,
			user_id
		})
		res.status(200).json({ success: true, data, error: null })
	} catch (e: unknown) {
		const err = e as HttpError
		res.status(err?.status || 500).json({ success: false, error: err?.error || "Internal Server Error" })
	}
}

export default { create: createProduct, get: selectProducts, getById: selectIdProduct, update: updateProduct }
