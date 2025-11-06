import type { ImagesTableType, UserImagesTableType } from "../db/schema"

export type Image = ImagesTableType
export type UserImage = UserImagesTableType
export type ImageId = Image["_id"]
export type ImageUrl = Image["url"]
export type ImageUserId = UserImage["user_id"]

export interface ImageCreate {
	id: ImageId
	// name: UserName
	url: ImageUrl
	user_id: ImageUserId
}
