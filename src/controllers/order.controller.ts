import type { Request, Response } from "express"
import { insertOrder, selectOrders } from "../models/order.model"
import { orderCreateSchema } from "../schemas/order.schema"

export async function createOrder(req: Request, res: Response) {
	if (!req.user) return res.status(401).json({ error: "Unauthorized" })
	const { _id: user_id } = req.user
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

export async function getOrders(req: Request, res: Response) {
	if (!req.user) return res.status(401).json({ error: "Unauthorized" })
	const { _id: user_id } = req.user
	const { page } = req.query as { page?: string }

	try {
		const data = await selectOrders({ user_id })
		res.status(200).json({ success: true, data: [], error: null })
	} catch (_) {}
}
