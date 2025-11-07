import { z } from "zod"
import { orderPaymentMethodValues, orderSortByValues, orderStatusValues } from "../types/order"

export const orderCreateSchema = z.object({
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

export const orderSelectSchema = z
	.object({
		status: z.enum(orderStatusValues, { errorMap: () => ({ message: "Estado invalido." }) }).optional(),
		from: z.string().optional(),
		to: z.string().optional(),
		sort_by: z
			.enum(orderSortByValues, { errorMap: () => ({ message: "Ordenar By invalido." }) })
			.optional()
			.default("created_at"),
		sort_order: z.enum(["asc", "desc"]).optional().default("desc"),
		page: z.string().optional().default("1"),
		limit: z.string().optional().default("15")
	})
	.refine(
		({ from, to }) => {
			if (from && to) {
				const fromDate = new Date(from).getTime()
				const toDate = new Date(to).getTime()
				return fromDate <= toDate
			}
			return true
		},
		{
			message: "La fecha 'from' debe ser anterior o igual a 'to'.",
			path: ["to"]
		}
	)
