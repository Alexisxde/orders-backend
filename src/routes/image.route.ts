import express from "express"
import { getAllImages, postImage } from "../controllers/image.controller"
import upload from "../middlewares/multer"

const router = express.Router()

router.get("/:id", getAllImages)
router.post("/upload", upload.single("image"), postImage)

export default router
