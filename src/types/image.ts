import type { ImagesTableType as Image, UserImagesTableType as UserImage } from "../db/schema"

export type ImageId = Image["_id"]
export type ImageUrl = Image["url"]
export type ImageUserId = UserImage["user_id"]

export interface ImageCreate {
	id: ImageId
	// name: UserName
	url: ImageUrl
	user_id: ImageUserId
}
