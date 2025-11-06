import type { Request, Response } from "express"
import { insertOrder, selectOrders } from "../models/order.model"
import type { UserJWT } from "../types/auth"
import type { HttpError } from "../types/error"

export async function createOrder(req: Request, res: Response) {
	const { _id: user_id } = req.body.user as UserJWT
	const { name, payment_method, phone, orders } = req.body

	try {
		const data = await insertOrder({ name, payment_method, phone, user_id, orders })
		res.status(201).json({ success: true, data, error: null })
	} catch (e: unknown) {
		const err = e as HttpError
		res.status(err?.status || 500).json({ success: false, error: err?.message || "Internal Server Error" })
	}
}

type ReqQuery = { page: string; per_page: string }

export async function getOrders(req: Request, res: Response) {
	const { _id: user_id } = req.body.user as UserJWT
	const { page, per_page } = req.query as ReqQuery
	const { status, sort_by, sort_order } = req.body

	try {
		const data = await selectOrders({ page, per_page, status, sort_by, sort_order, user_id })
		res.status(200).json({ success: true, data, error: null })
	} catch (e: unknown) {
		const err = e as HttpError
		res.status(err?.status || 500).json({ success: false, error: err?.message || "Internal Server Error" })
	}
}
