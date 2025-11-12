import { z } from "zod"
import { orderStatusValues } from "../types/order"

export const orderSelectReportMonthQuerysSchema = z.object({
	status: z
		.enum(orderStatusValues, { errorMap: () => ({ message: `Estados validos: ${orderStatusValues.join(", ")}` }) })
		.default("delivered")
})

export const orderSelectReportDayQuerysSchema = z.object({
	date: z
		.string({ invalid_type_error: "Debe ser un texto." })
		.regex(/^\d{4}-\d{2}-\d{2}$/, { message: "El formato de la fecha es invalido. Use YYYY-MM-DD." }),
	status: z
		.enum(orderStatusValues, { errorMap: () => ({ message: `Estados validos: ${orderStatusValues.join(", ")}` }) })
		.default("delivered")
})
