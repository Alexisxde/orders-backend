import bcrypt from "bcrypt"
import type { Request, Response } from "express"
import jwt from "jsonwebtoken"
import type { z } from "zod"
import { JWT_SECRET, JWT_SECRET_REFRESHTOKEN, NODE_ENV } from "../config"
import { createUser, getUserByEmail, UserById } from "../models/user.model"
import type { userCreateBodySchema, userLoginBodySchema } from "../schemas/auth.schema"
import type { UserJWT } from "../types/auth"
import type { HttpError } from "../types/error"

export async function registerUser(req: Request, res: Response) {
	const { name, email, password } = req.body as z.infer<typeof userCreateBodySchema>

	try {
		const existingUser = await getUserByEmail(email)
		if (existingUser) throw { status: 409, message: "El usuario ya existe. Intentelo de nuevo con otro email." }

		const data = await createUser({ name, email, password })
		res.status(201).json({ success: true, data, error: null })
	} catch (e: unknown) {
		const err = e as HttpError
		res.status(err?.status || 500).json({ success: false, error: err?.message || "Internal Server Error" })
	}
}

export async function loginUser(req: Request, res: Response) {
	const { email, password } = req.body as z.infer<typeof userLoginBodySchema>

	try {
		const user = await getUserByEmail(email)
		if (!user) throw { status: 404, message: "Usuario no encontrado. Por favor intentelo de nuevo." }

		const isValid = await bcrypt.compare(password, user.password)
		if (!isValid) throw { status: 404, message: "Las credenciales proporcionadas no son válidas." }

		const { _id, role } = user
		const token = jwt.sign({ _id, role }, JWT_SECRET, { expiresIn: "8h" })
		const refreshToken = jwt.sign({ _id, role }, JWT_SECRET_REFRESHTOKEN, { expiresIn: "7d" })

		res.cookie("token", token, {
			httpOnly: true,
			secure: NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 6 * 60 * 60 * 1000
		})
		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 7 * 24 * 60 * 60 * 1000
		})

		const { password: _, ...data } = user
		res.status(200).json({ success: true, data, error: null })
	} catch (e: unknown) {
		const err = e as HttpError
		res.status(err?.status || 500).json({ success: false, error: err?.message || "Internal Server Error" })
	}
}

export async function logoutUser(_: Request, res: Response) {
	try {
		res.clearCookie("token", {
			httpOnly: true,
			secure: NODE_ENV === "production",
			sameSite: "lax"
		})

		res.clearCookie("refreshToken", {
			httpOnly: true,
			secure: NODE_ENV === "production",
			sameSite: "lax"
		})

		res.status(200).json({ success: true, error: null })
	} catch (e: unknown) {
		const err = e as HttpError
		res.status(err?.status || 500).json({ success: false, error: err?.message || "Internal Server Error" })
	}
}

export async function getCurrentUser(req: Request, res: Response) {
	const token = req.cookies.token
	try {
		if (!token) throw { status: 401, message: "No hay token." }
		const decoded = jwt.verify(token, JWT_SECRET) as UserJWT
		const user = await UserById(decoded._id)
		if (!user) throw { status: 404, message: "Usuario no encontrado." }

		const { password: _, ...data } = user
		res.status(200).json({ success: true, data, error: null })
	} catch (e: unknown) {
		const err = e as HttpError
		res.status(err?.status || 500).json({ success: false, error: err?.message || "Internal Server Error" })
	}
}

export async function refresh(req: Request, res: Response) {
	const refreshToken = req.cookies.refreshToken

	try {
		if (!refreshToken) throw { status: 401, message: "No hay refresh token." }
		const decoded = jwt.verify(refreshToken, JWT_SECRET_REFRESHTOKEN) as UserJWT
		const newToken = jwt.sign(decoded, JWT_SECRET, { expiresIn: "8h" })

		res.cookie("token", newToken, {
			httpOnly: true,
			secure: NODE_ENV === "production",
			sameSite: "none",
			maxAge: 60 * 60 * 1000
		})

		return res.status(200).json({ success: true, message: "Token renovado.", error: null })
	} catch (e: unknown) {
		const err = e as HttpError
		res.status(err?.status || 500).json({ success: false, error: err?.message || "Internal Server Error" })
	}
}
