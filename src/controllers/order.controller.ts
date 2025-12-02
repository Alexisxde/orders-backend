import type { Request, Response } from "express"
import type { z } from "zod"
import OrderModel from "../models/order.model"
import type { orderCreateBodySchema, orderSelectQuerySchema } from "../schemas/order.schema"
import type { UserJWT } from "../types/auth"
import type { HttpError } from "../types/error"

export async function createOrder(req: Request, res: Response) {
	const { _id: user_id } = req.body.user as UserJWT
	const { name, payment_method, phone, orders } = req.body as z.infer<typeof orderCreateBodySchema>

	try {
		const data = await OrderModel.insert({ name, payment_method, phone, user_id, orders })
		res.status(201).json({ success: true, data, error: null })
	} catch (e: unknown) {
		const err = e as HttpError
		res.status(err?.status || 500).json({ success: false, error: err?.error || "Internal Server Error" })
	}
}

export async function getOrders(req: Request, res: Response) {
	const { _id: user_id } = req.body.user as UserJWT
	const { page, limit, from, to, status, sort_by, sort_order } = req.query as z.infer<typeof orderSelectQuerySchema>

	try {
		const data = await OrderModel.select({ page, per_page: limit, status, from, to, sort_by, sort_order, user_id })
		res.status(200).json({ success: true, data, error: null })
	} catch (e: unknown) {
		const err = e as HttpError
		res.status(err?.status || 500).json({ success: false, error: err?.error || "Internal Server Error" })
	}
}

export default { create: createOrder, get: getOrders }
