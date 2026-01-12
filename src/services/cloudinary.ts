import { v2 as cloudinary } from "cloudinary"
import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME } from "../config"

cloudinary.config({
	cloud_name: CLOUDINARY_CLOUD_NAME,
	api_key: CLOUDINARY_API_KEY,
	api_secret: CLOUDINARY_API_SECRET
})

export const deleteImageFromCloudinary = async (public_id: string) => {
	return new Promise<void>((res, rej) => {
		cloudinary.uploader.destroy(public_id, (error, result) => {
			if (error) return rej(new Error(`Error remove image: ${error.message}`))
			if (!result) return rej(new Error("No response received from Cloudinary"))
			if (result.result === "not found") return rej(new Error(`The image with public_id "${public_id}" not found`))
			res()
		})
	})
}
