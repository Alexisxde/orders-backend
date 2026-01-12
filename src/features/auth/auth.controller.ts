import type { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import { JWT_SECRET, JWT_SECRET_REFRESHTOKEN, NODE_ENV } from "../../config"
import type { LoginUser, RegisterUser, UpdateUser } from "./auth.schema"
import AuthService from "./auth.service"
import type { UserJWT } from "./auth.types"

export async function register(req: Request, res: Response, next: NextFunction) {
	const { name, email, password } = req.body as RegisterUser
	try {
		const data = await AuthService.create({ name, email, password })
		res.status(201).json({ success: true, data, error: null })
	} catch (err) {
		next(err)
	}
}

export async function login(req: Request, res: Response, next: NextFunction) {
	const { email, password } = req.body as LoginUser

	try {
		const { id, role, name } = await AuthService.validate({ email, password })
		const token = jwt.sign({ id, role }, JWT_SECRET, { expiresIn: "8h" })
		const refreshToken = jwt.sign({ id, role }, JWT_SECRET_REFRESHTOKEN, { expiresIn: "7d" })

		res.cookie("token", token, {
			httpOnly: true,
			secure: NODE_ENV === "production",
			sameSite: "none",
			maxAge: 6 * 60 * 60 * 1000
		})
		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: NODE_ENV === "production",
			sameSite: "none",
			maxAge: 7 * 24 * 60 * 60 * 1000
		})

		res.status(200).json({ success: true, message: `Bienvenido ${name}`, error: null })
	} catch (err) {
		next(err)
	}
}

export async function logout(_: Request, res: Response) {
	res.clearCookie("token", {
		httpOnly: true,
		secure: NODE_ENV === "production",
		sameSite: "none"
	})

	res.clearCookie("refreshToken", {
		httpOnly: true,
		secure: NODE_ENV === "production",
		sameSite: "none"
	})

	res.status(200).json({ success: true, error: null })
}

export async function user(req: Request, res: Response, next: NextFunction) {
	const { id: userId } = req.body.user as UserJWT

	try {
		const data = await AuthService.getById({ userId })
		res.status(200).json({ success: true, data, error: null })
	} catch (err) {
		next(err)
	}
}

export async function update(req: Request, res: Response, next: NextFunction) {
	const { id: userId } = req.body.user as UserJWT
	const file = req.file
	const { name } = req.body as UpdateUser

	try {
		const data = await AuthService.update({ userId, data: { file, name } })
		res.status(200).json({ success: true, data, error: null })
	} catch (err) {
		next(err)
	}
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
	const refreshToken = req.cookies.refreshToken

	try {
		if (!refreshToken) throw { status: 401, error: "No hay refresh token." }
		const decoded = jwt.verify(refreshToken, JWT_SECRET_REFRESHTOKEN) as UserJWT
		const newToken = jwt.sign(decoded, JWT_SECRET, { expiresIn: "8h" })

		res.cookie("token", newToken, {
			httpOnly: true,
			secure: NODE_ENV === "production",
			sameSite: "none",
			maxAge: 60 * 60 * 1000
		})

		res.status(200).json({ success: true, error: null })
	} catch (err) {
		next(err)
	}
}

export default { register, login, user, update, logout, refresh }
