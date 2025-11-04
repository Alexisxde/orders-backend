import type { Request, Response } from "express"
import { insertOrder } from "../models/order.model"
import { orderCreateSchema } from "../schemas/order.schema"

export async function createOrder(req: Request, res: Response) {
	if (!req.body.user) return res.status(404).json({ success: false, error: "Ocurrió un error inesperado." })
	const { _id: user_id } = req.body.user
	const { success, error, data } = orderCreateSchema.safeParse(req.body)

	if (!success)
		return res.status(400).json({ errors: error.errors.map((err) => ({ field: err.path[0], message: err.message })) })

	const { name, payment_method, phone, orders } = data

	try {
		const data = await insertOrder({ name, payment_method, phone, user_id, orders })
		res.status(201).json({ success: true, data, error: null })
	} catch (_) {
		return []
	}
}
