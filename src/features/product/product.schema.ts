import { z } from "zod"
import { CategoriesValues } from "./product.types"

export const create = z.object({
	name: z
		.string({
			required_error: "El nombre del producto es obligatorio",
			invalid_type_error: "El nombre debe ser una cadena de texto"
		})
		.min(1, { message: "El nombre no puede estar vacío" }),
	description: z.string({ invalid_type_error: "La descripción debe ser una cadena de texto" }).optional(),
	price: z
		.string({ required_error: "El precio es obligatorio", invalid_type_error: "El precio debe ser un string" })
		.transform((val) => Number(val))
		.refine((val) => !Number.isNaN(val), { message: "El precio debe ser un número válido." })
		.refine((val) => val >= 0, { message: "El precio no puede ser negativo." }),
	category: z.enum(CategoriesValues, { errorMap: () => ({ message: "Categoria invalida." }) })
})

export type CreateProductDto = z.infer<typeof create>

export const update = z.object({
	name: z.string().min(1, { message: "El nombre no puede estar vacío." }).optional(),
	description: z.string().min(1, { message: "La descripción no puede estar vacío." }).optional(),
	price: z
		.string()
		.transform((val) => Number(val))
		.refine((val) => !Number.isNaN(val), { message: "El precio debe ser un número válido." })
		.refine((val) => val >= 0, { message: "El precio no puede ser negativo." })
		.optional(),
	category: z.enum(CategoriesValues, { errorMap: () => ({ message: "Categoria invalida." }) }).optional(),
	disabled: z.boolean({ invalid_type_error: "Tiene que ser true o false." }).optional()
})

export type UpdateProductDto = z.infer<typeof update>

export default { create, update }
