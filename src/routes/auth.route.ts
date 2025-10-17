import { Router } from "express"
import { registerUser } from "../controllers/auth.controller"

const router = Router()

router.post("/register", registerUser)
// router.post("/login", loginAdmin)
// router.post("/logout", logoutAdmin)
// router.post("/refresh", refresh)
// router.get("/me", getCurrentAdmin)

export default router
