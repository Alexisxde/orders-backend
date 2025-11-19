import { eq } from "drizzle-orm"
import db from "../db/db"
import { ImagesTable, UserImagesTable } from "../db/schema"
import type { InsertImage } from "../types/image"

export async function insertImage({ _id, url, user_id }: InsertImage) {
	const id = crypto.randomUUID()
	try {
		const [image] = await db.insert(ImagesTable).values({ _id, url }).returning()
		const [result] = await db.insert(UserImagesTable).values({ _id: id, image_id: image._id, user_id }).returning()
		return { _id: result._id, image_id: result.image_id, url: image.url }
	} catch (_) {
		throw {
			status: 500,
			error: "No se pudo guardar la información en la base de datos. Intente nuevamente más tarde."
		}
	}
}

export async function getImages(user_id: string) {
	try {
		const result = await db
			.select({
				imageId: UserImagesTable.image_id,
				imageUrl: ImagesTable.url
			})
			.from(UserImagesTable)
			.where(eq(UserImagesTable.user_id, user_id))
			.leftJoin(ImagesTable, eq(ImagesTable._id, UserImagesTable.image_id))
		return result
	} catch (_) {}
}
