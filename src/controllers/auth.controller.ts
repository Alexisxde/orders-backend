import type { Request, Response } from "express"
import { createUser } from "../models/user.model"
import { userCreateSchema } from "../schemas/auth.schema"
import type { UserCreate } from "../types/auth"

export const registerUser = async (req: Request<unknown, unknown, UserCreate>, res: Response) => {
	const { success, error, data } = userCreateSchema.safeParse(req.body)

	if (!success)
		return res.status(400).json({ errors: error.errors.map((err) => ({ field: err.path[0], message: err.message })) })

	const { name, email, password } = data

	try {
		// TODO: Hay que implementar estas funciones:
		// * const existingUser = await getUserByEmail(email)
		// * if (existingUser) return res.status(409).json({ error: "El usuario ya existe" })

		const newUser = await createUser({ name, email, password })
		res.status(201).json(newUser)
	} catch (_) {
		res.status(500).json({ error: "Error al registrar el usuario. Intentelo de nuevo más tarde." })
	}
}

// export const loginAdmin = async (req: Request, res: Response) => {
// 	const { email, password } = req.body

// 	try {
// 		const admin = await getAdminByEmail(email)
// 		if (!admin) return res.status(404).json({ error: "Admin no encontrado" })

// 		const isValid = await bcrypt.compare(password, admin.password_hash)
// 		if (!isValid) return res.status(401).json({ error: "Contraseña incorrecta" })

// 		const token = jwt.sign({ admin_id: admin.id, email: admin.email }, JWT_SECRET, { expiresIn: "1h" })
// 		const refreshToken = jwt.sign({ admin_id: admin.id, email: admin.email }, JWT_SECRET_REFRESHTOKEN, {
// 			expiresIn: "7d"
// 		})

// 		res.cookie("token", token, {
// 			httpOnly: true,
// 			secure: NODE_ENV === "production",
// 			sameSite: "none",
// 			maxAge: 6 * 60 * 60 * 1000
// 		})

// 		res.cookie("refreshToken", refreshToken, {
// 			httpOnly: true,
// 			secure: NODE_ENV === "production",
// 			sameSite: "none",
// 			maxAge: 7 * 24 * 60 * 60 * 1000
// 		})
// 		const { _, ...admin_data } = admin
// 		res.status(200).json({ message: "Login exitoso", admin_data })
// 	} catch (_) {
// 		res.status(500).json({ error: "Error al iniciar sesión" })
// 	}
// }

// export const refresh = (req: Request, res: Response) => {
// 	const refreshToken = req.cookies.refreshToken
// 	if (!refreshToken) return res.status(401).json({ error: "No hay refresh token" })

// 	try {
// 		const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESHTOKEN)
// 		const newToken = jwt.sign({ admin_id: decoded.admin_id, email: decoded.email }, JWT_SECRET, {
// 			expiresIn: "1h"
// 		})

// 		res.cookie("token", newToken, {
// 			httpOnly: true,
// 			secure: NODE_ENV === "production",
// 			sameSite: "none",
// 			maxAge: 60 * 60 * 1000
// 		})
// 		return res.status(200).json({ message: "Token renovado" })
// 	} catch (_) {
// 		return res.status(403).json({ error: "Refresh token inválido o expirado" })
// 	}
// }

// export const logoutAdmin = async (_: Request, res: Response) => {
// 	try {
// 		res.clearCookie("token", {
// 			httpOnly: true,
// 			secure: NODE_ENV === "production",
// 			sameSite: "strict",
// 			maxAge: 6 * 60 * 60 * 1000 // 6 horas
// 		})

// 		res.clearCookie("refreshToken", {
// 			httpOnly: true,
// 			secure: process.env.NODE_ENV === "production",
// 			sameSite: "strict",
// 			maxAge: 7 * 24 * 60 * 60 * 1000
// 		})
// 		res.status(200).json({ message: "Logout exitoso" })
// 	} catch (_) {
// 		res.status(500).json({ error: "Error al cerrar sesión" })
// 	}
// }

// export const getCurrentAdmin = async (req: Request, res: Response) => {
// 	if (!req?.user) return res.status(401).json({ error: "No autorizado" })

// 	try {
// 		const admin = await AdminById(req.user.admin_id)
// 		if (!admin) {
// 			return res.status(404).json({ error: "Admin no encontrado" })
// 		}
// 		res.status(200).json({
// 			admin_id: admin.id,
// 			email: admin.email,
// 			nombre: admin.nombre
// 		})
// 	} catch (_) {
// 		res.status(500).json({ error: "Error al obtener admin" })
// 	}
// }
