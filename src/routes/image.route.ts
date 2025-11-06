import express from "express"
import { getAllImages, postImage } from "../controllers/image.controller"
import upload from "../middlewares/multer"
import { verifySession } from "../middlewares/verify-session"

const router = express.Router()

router.get("/", verifySession, getAllImages)
router.post("/upload", upload.single("image"), verifySession, postImage)

export default router
