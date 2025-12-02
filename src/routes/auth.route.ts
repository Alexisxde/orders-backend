import { Router } from "express"
import AuthController from "../controllers/auth.controller"
import { schemaBodyValidator } from "../middlewares/schema-validator"
import { verifySession } from "../middlewares/verify-session"
import { userCreateBodySchema, userLoginBodySchema, userUpdateBodySchema } from "../schemas/auth.schema"

const router = Router()

router.post("/register", schemaBodyValidator(userCreateBodySchema), AuthController.register)
router.post("/login", schemaBodyValidator(userLoginBodySchema), AuthController.login)
router.post("/update", verifySession, schemaBodyValidator(userUpdateBodySchema), AuthController.update)
router.post("/logout", AuthController.logout)
router.post("/refresh", AuthController.refresh)
router.get("/user", verifySession, AuthController.user)

export default router
