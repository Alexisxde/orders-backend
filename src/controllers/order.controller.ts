import type { Request, Response } from "express"
import { insertOrder, selectOrders } from "../models/order.model"

export async function createOrder(req: Request, res: Response) {
	if (!req.body.user) return res.status(401).json({ error: "Unauthorized" })
	const { _id: user_id } = req.body.user
	const { name, payment_method, phone, orders } = req.body

	try {
		const data = await insertOrder({ name, payment_method, phone, user_id, orders })
		res.status(201).json({ success: true, data, error: null })
	} catch (_) {
		return []
	}
}

export async function getOrders(req: Request, res: Response) {
	if (!req.body.user) return res.status(401).json({ error: "Unauthorized" })
	const { _id: user_id } = req.body.user
	const { page, per_page, status, sort_by, sort_order } = req.body

	try {
		const data = await selectOrders({ page, per_page, status, sort_by, sort_order, user_id })
		res.status(200).json({ success: true, data, error: null })
	} catch (_) {}
}
