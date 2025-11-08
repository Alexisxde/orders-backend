import type { Request, Response } from "express"
import type { z } from "zod"
import { insertOrder, selectOrders } from "../models/order.model"
import type { orderCreateBodySchema, orderSelectBodySchema, orderSelectQuerySchema } from "../schemas/order.schema"
import type { UserJWT } from "../types/auth"
import type { HttpError } from "../types/error"

export async function createOrder(req: Request, res: Response) {
	const { _id: user_id } = req.body.user as UserJWT
	const { name, payment_method, phone, orders } = req.body as z.infer<typeof orderCreateBodySchema>

	try {
		const data = await insertOrder({ name, payment_method, phone, user_id, orders })
		res.status(201).json({ success: true, data, error: null })
	} catch (e: unknown) {
		const err = e as HttpError
		res.status(err?.status || 500).json({ success: false, error: err?.message || "Internal Server Error" })
	}
}

export async function getOrders(req: Request, res: Response) {
	const { _id: user_id } = req.body.user as UserJWT
	const { page, limit: per_page } = req.query as z.infer<typeof orderSelectQuerySchema>
	const { from, to, status, sort_by, sort_order } = req.body as z.infer<typeof orderSelectBodySchema>

	try {
		const data = await selectOrders({ page, per_page, status, from, to, sort_by, sort_order, user_id })
		res.status(200).json({ success: true, data, error: null })
	} catch (e: unknown) {
		const err = e as HttpError
		res.status(err?.status || 500).json({ success: false, error: err?.message || "Internal Server Error" })
	}
}
