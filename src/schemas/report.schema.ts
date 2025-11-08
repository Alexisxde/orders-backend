import { z } from "zod"
import { orderStatusValues } from "../types/order"

export const orderSelectReportMonthSchema = z.object({
	year: z.number({ invalid_type_error: "Debe ser un número." }).int().positive(),
	status: z.enum(orderStatusValues, { errorMap: () => ({ message: "Estado invalido." }) }).default("delivered")
})

export const orderSelectReportDaySchema = z.object({
	date: z.string({ invalid_type_error: "Debe ser un texto." }),
	status: z.enum(orderStatusValues, { errorMap: () => ({ message: "Estado invalido." }) }).default("delivered")
})
