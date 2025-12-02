import bcrypt from "bcrypt"
import type { Request, Response } from "express"
import jwt from "jsonwebtoken"
import type { z } from "zod"
import { JWT_SECRET, JWT_SECRET_REFRESHTOKEN, NODE_ENV } from "../config"
import UserModel from "../models/user.model"
import type { userCreateBodySchema, userLoginBodySchema, userUpdateBodySchema } from "../schemas/auth.schema"
import type { UserJWT } from "../types/auth"
import type { HttpError } from "../types/error"
import { postOneImage } from "./image.controller"

export async function register(req: Request, res: Response) {
	const { name, email, password } = req.body as z.infer<typeof userCreateBodySchema>

	try {
		const existingUser = await UserModel.getByEmail(email)
		if (existingUser) throw { status: 409, message: "El usuario ya existe. Intentelo de nuevo con otro email." }

		const data = await UserModel.create({ name, email, password })
		res.status(201).json({ success: true, data, error: null })
	} catch (e: unknown) {
		const err = e as HttpError
		res.status(err?.status || 500).json({ success: false, error: err?.error || "Internal Server Error" })
	}
}

export async function login(req: Request, res: Response) {
	const { email, password } = req.body as z.infer<typeof userLoginBodySchema>

	try {
		const user = await UserModel.getByEmail(email)
		if (!user) throw { status: 404, message: "Usuario no encontrado. Por favor intentelo de nuevo." }

		const isValid = await bcrypt.compare(password, user.password)
		if (!isValid) throw { status: 404, message: "Las credenciales proporcionadas no son válidas." }

		const { _id, role } = user
		const token = jwt.sign({ _id, role }, JWT_SECRET, { expiresIn: "8h" })
		const refreshToken = jwt.sign({ _id, role }, JWT_SECRET_REFRESHTOKEN, { expiresIn: "7d" })

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

		const { password: _, ...data } = user
		res.status(200).json({ success: true, data, error: null })
	} catch (e: unknown) {
		const err = e as HttpError
		res.status(err?.status || 500).json({ success: false, error: err?.error || "Internal Server Error" })
	}
}

export async function logout(_: Request, res: Response) {
	try {
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
	} catch (e: unknown) {
		const err = e as HttpError
		res.status(err?.status || 500).json({ success: false, error: err?.error || "Internal Server Error" })
	}
}

export async function user(req: Request, res: Response) {
	const { _id: user_id } = req.body.user as UserJWT
	try {
		const user = await UserModel.getById(user_id)
		if (!user) throw { status: 404, error: "Usuario no encontrado." }
		const { password: _, ...data } = user
		res.status(200).json({ success: true, data, error: null })
	} catch (e: unknown) {
		const err = e as HttpError
		res.status(err?.status || 500).json({ success: false, error: err?.error || "Internal Server Error" })
	}
}

export async function update(req: Request, res: Response) {
	const { _id: user_id } = req.body.user as UserJWT
	const { name, email } = req.body as z.infer<typeof userUpdateBodySchema>
	const file = req.file
	let avatar: { _id: string; url: string } | null = null

	try {
		if (file) avatar = await postOneImage({ file })
		const data = await UserModel.update({ name, email, id_avatar: avatar?._id, user_id })
		res.status(200).json({ success: true, data, error: null })
	} catch (e: unknown) {
		const err = e as HttpError
		res.status(err?.status || 500).json({ success: false, error: err?.error || "Internal Server Error" })
	}
}

export async function refresh(req: Request, res: Response) {
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

		return res.status(200).json({ success: true, message: "Token renovado.", error: null })
	} catch (e: unknown) {
		const err = e as HttpError
		res.status(err?.status || 500).json({ success: false, error: err?.error || "Internal Server Error" })
	}
}

export default { register, login, user, update, logout, refresh }
