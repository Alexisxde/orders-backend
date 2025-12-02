import type { ImagesTableType as Image, UserImagesTableType as UserImage } from "../db/schema"

export type InsertImage = Required<Pick<Image, "_id" | "url"> & Pick<UserImage, "user_id">>
export type InsertOneImage = Omit<InsertImage, "user_id">
