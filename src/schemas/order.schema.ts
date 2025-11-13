import { z } from "zod"
import { orderPaymentMethodValues, orderSortByValues, orderStatusValues } from "../types/order"

export const orderCreateBodySchema = z.object({
	name: z
		.string({ required_error: "El nombre es obligatorio.", invalid_type_error: "Debe ser un texto." })
		.min(1, { message: "El nombre no puede estar vacío." }),
	phone: z.string().nullable().optional(),
	payment_method: z.enum(orderPaymentMethodValues, { errorMap: () => ({ message: "Metodo de pago invalido." }) }),
	orders: z
		.array(
			z.object({
				product_id: z.string({
					required_error: "El ID del producto es obligatorio.",
					invalid_type_error: "Debe ser un texto."
				}),
				quantity: z
					.number({ required_error: "La cantidad es obligatoria.", invalid_type_error: "Debe ser un número." })
					.int()
					.positive(),
				observation: z.string().optional()
			})
		)
		.min(1, { message: "Debe haber al menos un producto en la orden." })
})

export const orderSelectQuerySchema = z
	.object({
		page: z.string().optional().default("1"),
		limit: z.string().optional().default("15"),
		status: z
			.enum(orderStatusValues, { errorMap: () => ({ message: `Estados validos: ${orderStatusValues.join(", ")}` }) })
			.optional()
			.default("delivered"),
		from: z
			.string({ invalid_type_error: "Debe ser un texto." })
			.regex(/^\d{4}-\d{2}-\d{2}$/, { message: "El formato de la fecha es invalido. Use YYYY-MM-DD." })
			.optional(),
		to: z
			.string({ invalid_type_error: "Debe ser un texto." })
			.regex(/^\d{4}-\d{2}-\d{2}$/, { message: "El formato de la fecha es invalido. Use YYYY-MM-DD." })
			.optional(),
		sort_by: z
			.enum(orderSortByValues, { errorMap: () => ({ message: `Ordenar By validos: ${orderSortByValues.join(", ")}` }) })
			.optional()
			.default("created_at"),
		sort_order: z
			.enum(["asc", "desc"], { errorMap: () => ({ message: `Ordenar validos: ${["asc", "desc"].join(", ")}` }) })
			.optional()
			.default("desc")
	})
	.refine(
		({ from, to }) => {
			if (from && to) return new Date(from).getTime() <= new Date(to).getTime()
			return true
		},
		{
			message: "La fecha 'from' debe ser anterior o igual a 'to'.",
			path: ["to"]
		}
	)
