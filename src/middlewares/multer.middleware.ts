import multer from "multer"

const storage = multer.diskStorage({
	filename: (_, file, cb) => {
		cb(null, file.originalname)
	}
})

export default multer({ storage })
