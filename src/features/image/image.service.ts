import type { UploadApiResponse } from "cloudinary"
import cloudinary from "../../services/cloudinary"
import prisma from "../../services/prisma"

// biome-ignore lint/suspicious/noExplicitAny: Explanation
async function insert({ file, userId }: { file: any; userId: string }) {
	const filePath = file.path
	if (!file) throw { status: 400, error: [{ field: "file", message: "La imagen del producto es obligatorio." }] }
	else if (!file.mimetype.startsWith("image/"))
		throw { status: 400, error: [{ field: "file", message: "El archivo debe ser una imagen." }] }
	if (!filePath) throw { status: 400, error: [{ field: "file", message: "No se pudo acceder al archivo." }] }

	const { public_id: cloudId, secure_url: url }: UploadApiResponse = await cloudinary.uploader.upload(filePath)
	if (!cloudId || !url) throw { status: 500, error: "Invalid Cloudinary response." }

	return await prisma.image.create({ data: { cloudId, url, userId }, select: { id: true, url: true } })
}

export default { insert }
