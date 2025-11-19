import { z } from "zod"

export const imageUploadBodySchema = z.object({
	image: z
		.instanceof(File)
		.refine((file: File) => file.size <= 5 * 1024 * 1024, {
			message: "La imagen debe pesar máximo 5MB"
		})
		.refine((file) => ["image/png", "image/jpeg", "image/webp"].includes(file.type), {
			message: "Formato inválido, solo se permiten PNG, JPG o WEBP"
		})
})
