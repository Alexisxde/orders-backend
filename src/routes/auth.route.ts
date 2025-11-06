import { Router } from "express"
import { getCurrentUser, loginUser, logoutUser, registerUser } from "../controllers/auth.controller"
import { schemaBodyValidator } from "../middlewares/schema-validator"
import { verifySession } from "../middlewares/verify-session"
import { userCreateSchema, userLoginSchema } from "../schemas/auth.schema"

const router = Router()

router.post("/register", schemaBodyValidator(userCreateSchema), registerUser)
router.post("/login", schemaBodyValidator(userLoginSchema), loginUser)
router.post("/logout", logoutUser)
router.get("/user", verifySession, getCurrentUser)

export default router
