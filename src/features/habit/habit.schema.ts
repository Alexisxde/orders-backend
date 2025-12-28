import { z } from "zod"

const createHabitSchema = z.object({
	title: z
		.string({ required_error: "El título es obligatorio.", invalid_type_error: "El título debe ser un texto." })
		.min(6, { message: "El título debe tener al menos 6 caracteres." }),
	description: z.string({ invalid_type_error: "La descripción debe ser un texto." }).optional()
})

const updateHabitSchema = createHabitSchema.partial().extend({
	active: z.boolean({
		invalid_type_error: "El estado de activo debe ser un booleano."
	}).optional()
}) 

const createHabitLogSchema = z.object({
	completed: z.boolean({
		required_error: "El estado de completado es obligatorio.",
		invalid_type_error: "El estado de completado debe ser un booleano."
	}),
	date: z.preprocess(
		(val) => (typeof val === "string" ? new Date(val) : val),
		z.date({ required_error: "La fecha es obligatoria.", invalid_type_error: "La fecha debe ser una fecha válida." })
	)
})

const SelectHabitLog = z.object({
	date: z
		.string({ invalid_type_error: "Debe ser un texto." })
		.regex(/^\d{4}-\d{2}-\d{2}$/, { message: "El formato de la fecha es invalido. Use YYYY-MM-DD." })
		.optional()
})

export default {
	select: SelectHabitLog,
	create: createHabitSchema,
	update: updateHabitSchema,
	createLog: createHabitLogSchema
}
