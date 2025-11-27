import { z } from "zod"
import { orderStatusValues } from "../types/order"

export const orderSelectReportMonthQuerysSchema = z.object({
	status: z
		.enum(orderStatusValues, { errorMap: () => ({ message: `Estados validos: ${orderStatusValues.join(", ")}` }) })
		.default("delivered")
})

export const orderSelectReportDayQuerysSchema = z.object({
	date: z
		.string({ required_error: "El día es obligatorio.", invalid_type_error: "Debe ser un texto." })
		.regex(/^\d{4}-\d{2}-\d{2}$/, { message: "El formato de la fecha es invalido. Use YYYY-MM-DD." }),
	status: z
		.enum(orderStatusValues, { errorMap: () => ({ message: `Estados validos: ${orderStatusValues.join(", ")}` }) })
		.default("delivered")
})

export const orderSelectReportToMonthQuerysSchema = z.object({
	status: z
		.enum(orderStatusValues, { errorMap: () => ({ message: `Estados validos: ${orderStatusValues.join(", ")}` }) })
		.default("delivered"),
	month: z
		.string({ required_error: "El mes es obligatorio.", invalid_type_error: "El mes debe ser un string." })
		.regex(/^(0[1-9]|1[0-2])$/, {
			message: "El formato de la fecha es inválido. Use valores entre 01 y 12."
		})
		.transform((val) => Number(val))
		.refine((val) => !Number.isNaN(val), { message: "El mes debe ser un número." }),
	year: z
		.string({ required_error: "El año es obligatorio", invalid_type_error: "El año debe ser un string." })
		.regex(/^\d{4}$/, { message: "El formato de la fecha es invalido. Use YYYY." })
		.transform((val) => Number(val))
		.refine((val) => !Number.isNaN(val), { message: "El año debe ser un número." })
		.refine((val) => val >= 2025, { message: "El año tiene que estar en un rango desde 2025." })
})
