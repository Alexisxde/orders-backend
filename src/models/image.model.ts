import { eq } from "drizzle-orm"
import db from "../db/db"
import { ImagesTable } from "../db/schema"
import type { ImageCreate } from "../types/image"

export async function insertImage({ id, name, url, user_id }: ImageCreate) {
	try {
		const result = await db.insert(ImagesTable).values({ _id: id, name, url, user_id })
		return result.rows
	} catch (_) {}
}

export async function getImages(id: string) {
	try {
		const result = await db.select().from(ImagesTable).where(eq(ImagesTable.user_id, id))
		return result
	} catch (_) {}
}
