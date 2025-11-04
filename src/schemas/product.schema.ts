import { z } from "zod"

export const productCreateSchema = z.object({
	name: z
		.string({
			required_error: "El nombre del producto es obligatorio",
			invalid_type_error: "El nombre debe ser una cadena de texto"
		})
		.min(1, { message: "El nombre no puede estar vacío" })
		.max(100, { message: "El nombre no puede tener más de 100 caracteres" }),
	description: z
		.string({ invalid_type_error: "La descripción debe ser una cadena de texto" })
		.max(255, { message: "La descripción no puede tener más de 255 caracteres" })
		.optional(),
	price: z
		.number({ required_error: "El precio es obligatorio", invalid_type_error: "El precio debe ser un número" })
		.min(0, { message: "El precio no puede ser negativo" }),
	image_id: z.string({
		required_error: "La imagen es obligatoria",
		invalid_type_error: "El ID de imagen debe ser una cadena de texto"
	}),
	user_id: z.string({
		required_error: "El usuario es obligatorio",
		invalid_type_error: "El ID de usuario debe ser una cadena de texto"
	})
})
