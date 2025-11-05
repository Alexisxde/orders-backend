import type { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../config"
import { refresh } from "../controllers/auth.controller"
import type { User } from "../types/auth"

type UserToken = Omit<User, "password" | "created_at">

export const verifySession = (req: Request<{}, {}, { user?: UserToken }>, res: Response, next: NextFunction) => {
	const token = req.cookies.token
	const refreshToken = req.cookies.refreshToken

	if (!refreshToken) return res.status(401).json({ success: false, error: "No hay refresh token." })

	try {
		const decoded = jwt.verify(token, JWT_SECRET) as UserToken
		req.user = decoded
		return next()
	} catch (_) {
		refresh(req, res)
	}
}
