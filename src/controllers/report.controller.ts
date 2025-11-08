import type { Request, Response } from "express"
import type { z } from "zod"
import { selectOrdersToDay, selectOrdersToMonth } from "../models/order.model"
import type { orderSelectReportDaySchema, orderSelectReportMonthSchema } from "../schemas/report.schema"
import type { UserJWT } from "../types/auth"
import type { HttpError } from "../types/error"

export async function getReportOrdersToMonth(req: Request, res: Response) {
	const { _id: user_id } = req.body.user as UserJWT
	const { year, status } = req.body as z.infer<typeof orderSelectReportMonthSchema>

	try {
		const data = await selectOrdersToMonth({ year: year.toString(), status, user_id })
		res.status(200).json({ success: true, data, error: null })
	} catch (e: unknown) {
		const err = e as HttpError
		res.status(err?.status || 500).json({ success: false, error: err?.message || "Internal Server Error" })
	}
}

export async function getReportOrdersToDay(req: Request, res: Response) {
	const { _id: user_id } = req.body.user as UserJWT
	const { date, status } = req.body as z.infer<typeof orderSelectReportDaySchema>

	try {
		const data = await selectOrdersToDay({ date, status, user_id })
		res.status(200).json({ success: true, data, error: null })
	} catch (e: unknown) {
		const err = e as HttpError
		res.status(err?.status || 500).json({ success: false, error: err?.message || "Internal Server Error" })
	}
}
