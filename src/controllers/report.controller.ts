import type { Request, Response } from "express"
import type { z } from "zod"
import {
	selectOrders6Month,
	selectOrdersToDay,
	selectOrdersToMonth,
	selectOrdersTopClients,
	selectOrdersTopProducts
} from "../models/order.model"
import type {
	orderSelectReportDayQuerysSchema,
	orderSelectReportMonthQuerysSchema,
	orderSelectReportToMonthQuerysSchema
} from "../schemas/report.schema"
import type { UserJWT } from "../types/auth"
import type { HttpError } from "../types/error"

export async function getReportOrdersToMonth(req: Request, res: Response) {
	const { _id: user_id } = req.body.user as UserJWT
	const { status, month, year } = req.query as unknown as z.infer<typeof orderSelectReportToMonthQuerysSchema>

	try {
		const data = await selectOrdersToMonth({ status, month: month.toString(), year: year.toString(), user_id })
		res.status(200).json({ success: true, data, error: null })
	} catch (e: unknown) {
		const err = e as HttpError
		res.status(err?.status || 500).json({ success: false, error: err?.error || "Internal Server Error" })
	}
}

export async function getReportOrders6Month(req: Request, res: Response) {
	const { _id: user_id } = req.body.user as UserJWT
	const { status } = req.query as z.infer<typeof orderSelectReportMonthQuerysSchema>

	try {
		const data = await selectOrders6Month({ status, user_id })
		res.status(200).json({ success: true, data, error: null })
	} catch (e: unknown) {
		const err = e as HttpError
		res.status(err?.status || 500).json({ success: false, error: err?.error || "Internal Server Error" })
	}
}

export async function getReportOrdersToDay(req: Request, res: Response) {
	const { _id: user_id } = req.body.user as UserJWT
	const { date, status } = req.query as z.infer<typeof orderSelectReportDayQuerysSchema>

	try {
		const data = await selectOrdersToDay({ date, status, user_id })
		res.status(200).json({ success: true, data, error: null })
	} catch (e: unknown) {
		const err = e as HttpError
		res.status(err?.status || 500).json({ success: false, error: err?.error || "Internal Server Error" })
	}
}

export async function getReportOrdersTopClients(req: Request, res: Response) {
	const { _id: user_id } = req.body.user as UserJWT

	try {
		const data = await selectOrdersTopClients({ user_id })
		res.status(200).json({ success: true, data, error: null })
	} catch (e: unknown) {
		const err = e as HttpError
		res.status(err?.status || 500).json({ success: false, error: err?.error || "Internal Server Error" })
	}
}

export async function getReportOrdersTopProducts(req: Request, res: Response) {
	const { _id: user_id } = req.body.user as UserJWT

	try {
		const data = await selectOrdersTopProducts({ user_id })
		res.status(200).json({ success: true, data, error: null })
	} catch (e: unknown) {
		const err = e as HttpError
		res.status(err?.status || 500).json({ success: false, error: err?.error || "Internal Server Error" })
	}
}
