import type { InferModel } from "drizzle-orm"
import type { ImagesTable } from "./../db/schema"

export type Image = InferModel<typeof ImagesTable>
export type ImageId = Image["_id"]
export type ImageName = Image["name"]
export type ImageUrl = Image["url"]
export type ImageDescription = Image["description"]
export type ImageUserId = Image["user_id"]

export interface ImageCreate {
	id: ImageId
	name: UserName
	url: UserUrl
	description: ImageDescription
	user_id: ImageUserId
}
