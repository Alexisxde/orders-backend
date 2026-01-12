import { Router } from "express"
import SchemaMiddleware from "../../middlewares/schema.middleware"
import SessionMiddleware from "../../middlewares/session.middleware"
import AuthController from "./auth.controller"
import AuthSchema from "./auth.schema"

const router = Router()

router.post("/register", SchemaMiddleware.body(AuthSchema.register), AuthController.register)
router.post("/login", SchemaMiddleware.body(AuthSchema.login), AuthController.login)
router.patch("/update", SessionMiddleware, SchemaMiddleware.body(AuthSchema.update), AuthController.update)
router.post("/logout", AuthController.logout)
router.post("/refresh", AuthController.refresh)
router.get("/me", SessionMiddleware, AuthController.user)

export default router
