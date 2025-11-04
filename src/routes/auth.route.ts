import { Router } from "express"
import { getCurrentUser, loginUser, logoutUser, refresh, registerUser } from "../controllers/auth.controller"
import { verifySession } from "../middlewares/verify-session"

const router = Router()

router.post("/register", registerUser)
router.post("/login", loginUser)
router.post("/logout", logoutUser)
router.post("/refresh", refresh)
router.get("/user", verifySession, getCurrentUser)

export default router
