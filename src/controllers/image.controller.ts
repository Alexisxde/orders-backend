import type { Request, Response } from "express"
import { getImages, insertImage } from "../models/image.model"
import { uploadSchema } from "../schemas/image.schema"
import cloudinary from "../services/cloudinary"

export async function getAllImages(req: Request<{ id: string }>, res: Response) {
	const { id } = req.params
	if (!id) return res.status(404).json({ success: false, error: "Se necesita el id." })

	try {
		const data = await getImages(id)
		res.status(200).json({ data })
	} catch (_) {}
}

export async function postImage(req: Request, res: Response) {
	if (!req.body.user) return res.status(404).json({ success: false, error: "Ocurrió un error inesperado." })
	const { _id: user_id } = req.body.user

	const { success, error, data } = uploadSchema.safeParse(req.body)
	const errors: { field: string; message: string }[] = []

	if (!success) errors.push(...error.errors.map((err) => ({ field: String(err.path[0]), message: err.message })))

	if (!req.file) errors.push({ field: "file", message: "Archivo requerido" })
	else if (!req.file.mimetype.startsWith("image/"))
		errors.push({ field: "file", message: "El archivo debe ser una imagen" })

	const filePath = req.file?.path

	if (!filePath) errors.push({ field: "file", message: "No se pudo acceder al archivo" })

	if (errors.length > 0) return res.status(400).json({ success: false, errors })

	if (!data) return res.status(404).json({ success: false, error: "Ocurrió un error inesperado." })

	const { name, description } = data

	if (!filePath) return res.status(400).json({ success: false, error: "No file provided" })

	cloudinary.uploader.upload(filePath, async (err, result) => {
		if (err || !result) return res.status(500).json({ success: false, error: "Error uploading file" })

		if (!result.public_id || !result.url)
			return res.status(500).json({ success: false, error: "Invalid Cloudinary response" })

		const { public_id: id, url } = result

		const image = await insertImage({
			id,
			name,
			url,
			description,
			user_id
		})

		res.status(200).json({ success: true, data: image, error: null })
	})
}
