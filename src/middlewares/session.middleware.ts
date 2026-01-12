import type { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import { JWT_SECRET, JWT_SECRET_REFRESHTOKEN, NODE_ENV } from "../config"
import type { UserJWT } from "../features/auth/auth.types"
import { UNAUTHORIZED } from "../utils/http-status-code"

export default function verifySession(req: Request, res: Response, next: NextFunction) {
	const token = req.cookies.token
	const refreshToken = req.cookies.refreshToken
	if (!refreshToken) return res.status(UNAUTHORIZED).json({ success: false, error: "Unauthorized" })

	try {
		const decoded = jwt.verify(token, JWT_SECRET) as UserJWT
		req.body.user = decoded
		next()
	} catch (_) {
		try {
			const decoded = jwt.verify(refreshToken, JWT_SECRET_REFRESHTOKEN) as UserJWT
			const newToken = jwt.sign(decoded, JWT_SECRET, { expiresIn: "8h" })

			res.cookie("token", newToken, {
				httpOnly: true,
				secure: NODE_ENV === "production",
				sameSite: "none",
				maxAge: 60 * 60 * 1000
			})
			req.body.user = decoded
			next()
		} catch (_) {
			return res.status(403).json({ success: false, error: "Refresh token inválido o expirado." })
		}
		// refresh(req, res)
	}
}
