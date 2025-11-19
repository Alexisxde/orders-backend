import type { UploadApiResponse } from "cloudinary"
import type { Request, Response } from "express"
import { getImages, insertImage } from "../models/image.model"
import cloudinary from "../services/cloudinary"
import type { UserJWT } from "../types/auth"

export async function getAllImages(req: Request, res: Response) {
	const { _id: user_id } = req.body.user as UserJWT

	try {
		const data = await getImages(user_id)
		res.status(200).json({ success: true, data, error: null })
	} catch (_) {}
}

export async function postImage({ file, user_id }: { file: Express.Multer.File; user_id: string }) {
	const filePath = file.path
	if (!file) throw { status: 400, error: "Archivo requerido." }
	else if (!file.mimetype.startsWith("image/")) throw { status: 400, error: "El archivo debe ser una imagen." }
	if (!filePath) throw { status: 400, error: "No se pudo acceder al archivo" }

	try {
		const { public_id: _id, secure_url: url }: UploadApiResponse = await cloudinary.uploader.upload(filePath)
		if (!_id || !url) throw { status: 500, error: "Invalid Cloudinary response." }
		const image = await insertImage({ _id, url, user_id })
		return image
	} catch (_) {
		throw { status: 500, error: "Error uploading file." }
	}
}
