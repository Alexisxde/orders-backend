import { z } from "zod"
import { orderStatusValues } from "../types/order"

export const orderSelectReportMonthBodySchema = z.object({
	year: z
		.number({ invalid_type_error: "Debe ser un número." })
		.int()
		.positive()
		.min(2025, { message: "El año debe ser mayor o igual a 2025." }),
	status: z
		.enum(orderStatusValues, { errorMap: () => ({ message: `Estados validos: ${orderStatusValues.join(", ")}` }) })
		.default("delivered")
})

export const orderSelectReportDayBodySchema = z.object({
	date: z
		.string({ invalid_type_error: "Debe ser un texto." })
		.regex(/^\d{4}-\d{2}-\d{2}$/, { message: "El formato de la fecha es invalido. Use YYYY-MM-DD." }),
	status: z
		.enum(orderStatusValues, { errorMap: () => ({ message: `Estados validos: ${orderStatusValues.join(", ")}` }) })
		.default("delivered")
})
