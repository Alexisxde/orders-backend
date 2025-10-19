import bcrypt from "bcrypt"
import type { Request, Response } from "express"
import jwt from "jsonwebtoken"
import { JWT_SECRET, JWT_SECRET_REFRESHTOKEN, NODE_ENV } from "../config"
import { createUser, getUserByEmail, UserById } from "../models/user.model"
import { userCreateSchema, userLoginSchema } from "../schemas/auth.schema"
import type { User, UserCreate, UserLogin } from "../types/auth"

export const registerUser = async (req: Request<unknown, unknown, UserCreate>, res: Response) => {
	const { success, error, data } = userCreateSchema.safeParse(req.body)

	if (!success)
		return res.status(400).json({ errors: error.errors.map((err) => ({ field: err.path[0], message: err.message })) })

	const { name, email, password } = data

	try {
		const existingUser = await getUserByEmail(email)
		if (existingUser)
			return res.status(409).json({ success: false, error: "El usuario ya existe. Intentelo de nuevo con otro email." })

		const newUser = await createUser({ name, email, password })
		res.status(201).json({ success: true, data: newUser, error: null })
	} catch (_) {
		res.status(500).json({ success: false, error: "Error al registrar el usuario. Intentelo de nuevo más tarde." })
	}
}

export const loginUser = async (req: Request<unknown, unknown, UserLogin>, res: Response) => {
	const { success, error, data } = userLoginSchema.safeParse(req.body)

	if (!success)
		return res.status(400).json({ errors: error.errors.map((err) => ({ field: err.path[0], message: err.message })) })

	const { email, password } = data
	const user = await getUserByEmail(email)

	try {
		if (!user) return res.status(404).json({ error: "Usuario no encontrado. Por favor intentelo de nuevo." })

		const isValid = await bcrypt.compare(password, user.password)
		if (!isValid) return res.status(401).json({ error: "Las credenciales proporcionadas no son válidas." })

		const { _id, name, email, role } = user
		const token = jwt.sign({ _id, name, email, role }, JWT_SECRET, { expiresIn: "8h" })
		const refreshToken = jwt.sign({ _id, name, email, role }, JWT_SECRET_REFRESHTOKEN, { expiresIn: "7d" })

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
	} catch (_) {
		res.status(500).json({ success: false, error: "Error al iniciar sesión. Intentelo de nuevo." })
	}
}

export const logoutUser = async (_: Request, res: Response) => {
	try {
		res.clearCookie("token", {
			httpOnly: true,
			secure: NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 6 * 60 * 60 * 1000
		})

		res.clearCookie("refreshToken", {
			httpOnly: true,
			secure: NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 7 * 24 * 60 * 60 * 1000
		})

		res.status(200).json({ success: true, message: "Logout exitoso", error: null })
	} catch (_) {
		res.status(500).json({ success: false, error: "Error al cerrar sesión. Intentelo de nuevo." })
	}
}

export const getCurrentUser = async (req: Request, res: Response) => {
	if (!req.body._id) return res.status(401).json({ success: false, error: "No autorizado." })

	try {
		const user = await UserById(req.body._id)
		if (!user) return res.status(404).json({ success: false, error: "Usuario no encontrado." })
		const { password: _, ...data } = user

		res.status(200).json({ success: true, data, error: null })
	} catch (_) {
		res.status(500).json({ success: false, error: "Error al obtener el usuario. Intentelo de nuevo." })
	}
}

export const refresh = (req: Request, res: Response) => {
	const refreshToken = req.cookies.refreshToken
	if (!refreshToken) return res.status(401).json({ success: false, error: "No hay refresh token." })

	try {
		const decoded = jwt.verify(refreshToken, JWT_SECRET_REFRESHTOKEN) as Omit<User, "password" | "created_at">
		const newToken = jwt.sign(decoded, JWT_SECRET, { expiresIn: "8h" })

		res.cookie("token", newToken, {
			httpOnly: true,
			secure: NODE_ENV === "production",
			sameSite: "none",
			maxAge: 60 * 60 * 1000
		})

		return res.status(200).json({ success: true, message: "Token renovado.", error: null })
	} catch (_) {
		return res.status(403).json({ success: false, error: "Refresh token inválido o expirado." })
	}
}
