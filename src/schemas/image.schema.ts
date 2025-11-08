import { z } from "zod"

export const imageUploadBodySchema = z.object({
	name: z
		.string({ required_error: "El nombre es obligatorio.", invalid_type_error: "El nombre debe ser un texto." })
		.min(2, { message: "El nombre debe tener al menos 2 caracteres." })
})
