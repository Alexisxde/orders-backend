import { z } from "zod"
import { orderPaymentMethodValues, orderStatusValues } from "../types/order"

export const orderCreateSchema = z.object({
	name: z.string({ required_error: "El nombre es obligatorio.", invalid_type_error: "Debe ser un texto." }),
	phone: z.string().nullable().optional(),
	payment_method: z.enum(orderPaymentMethodValues, { errorMap: () => ({ message: "Metodo de pago invalido." }) }),
	status: z.enum(orderStatusValues, { errorMap: () => ({ message: "Estado invalido." }) }),
	total: z.string({ required_error: "El total es obligatorio.", invalid_type_error: "Debe ser un texto." }),
	user_id: z.string({ required_error: "El ID de usuario es obligatorio.", invalid_type_error: "Debe ser un texto." })
})

export const orderSelectSchema = z
	.object({
		status: z.enum([...orderStatusValues, "all"], { errorMap: () => ({ message: "Estado invalido." }) }),
		from: z
			.string()
			.refine((val) => !Number.isNaN(Date.parse(val)), { message: "La fecha 'from' no es válida." })
			.optional(),
		to: z
			.string()
			.refine((val) => !Number.isNaN(Date.parse(val)), { message: "La fecha 'to' no es válida." })
			.optional(),
		sort_by: z.enum(["created_at", "total", "status"]).optional().default("created_at"),
		sort_order: z.enum(["asc", "desc"]).optional().default("desc"),
		page: z.number().int().positive().optional().default(1),
		per_page: z.number().int().positive().optional().default(15)
	})
	.refine((data) => data?.from && data.to && new Date(data?.from) <= new Date(data.to), {
		message: "La fecha 'from' debe ser anterior o igual a 'to'.",
		path: ["to"]
	})
