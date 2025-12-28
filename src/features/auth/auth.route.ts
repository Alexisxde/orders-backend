import { Router } from "express"
import Validator from "../../middlewares/schema.middleware"
import { verifySession } from "../../middlewares/session.middleware"
import AuthController from "./auth.controller"
import AuthSchema from "./auth.schema"

const router = Router()

router.post("/register", Validator.body(AuthSchema.register), AuthController.register)
router.post("/login", Validator.body(AuthSchema.login), AuthController.login)
router.patch("/update", verifySession, Validator.body(AuthSchema.update), AuthController.update)
router.post("/logout", AuthController.logout)
router.post("/refresh", AuthController.refresh)
router.get("/me", verifySession, AuthController.user)

export default router
