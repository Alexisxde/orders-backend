import { z } from "zod"

export const userCreateSchema = z.object({
	name: z
		.string({ required_error: "El nombre es obligatorio.", invalid_type_error: "El nombre debe ser un texto." })
		.min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
	email: z
		.string({ required_error: "El email es obligatorio.", invalid_type_error: "El email debe ser un texto." })
		.email({ message: "Debe ser un email válido." }),
	password: z
		.string({ required_error: "La contraseña es obligatoria.", invalid_type_error: "La contraseña debe ser un texto." })
		.min(8, { message: "La contraseña debe tener al menos 8 caracteres." })
		.refine((val) => /[A-Z]/.test(val), { message: "Debe contener al menos una letra mayúscula." })
		.refine((val) => /\d/.test(val), { message: "Debe contener al menos un número." })
		.refine((val) => /^[a-zA-Z\d]+$/.test(val), { message: "Solo se permiten letras y números." })
})
