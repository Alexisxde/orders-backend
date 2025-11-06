import bcrypt from "bcrypt"
import { eq } from "drizzle-orm"
import db from "../db/db"
import { UserTable } from "../db/schema"
import type { UserCreate, UserEmail, UserId } from "../types/auth"

export const createUser = async ({ name, email, password }: UserCreate) => {
	const SALT = 10
	const _id = crypto.randomUUID()

	try {
		const hashedPassword = (await bcrypt.hash(password, SALT)) as string
		const result = await db.insert(UserTable).values({ _id, name, email, password: hashedPassword }).returning()
		return result[0]
	} catch (_) {
		throw {
			status: 500,
			message: "No se pudo guardar la información en la base de datos. Intente nuevamente más tarde."
		}
	}
}

export const getUserByEmail = async (email: UserEmail) => {
	try {
		const result = await db
			.select({
				_id: UserTable._id,
				name: UserTable.name,
				email: UserTable.email,
				password: UserTable.password,
				role: UserTable.role
			})
			.from(UserTable)
			.where(eq(UserTable.email, email))
		return result[0]
	} catch (_) {
		throw { status: 500, message: "No se pudo obtener la información del usuario. Intente nuevamente más tarde." }
	}
}

export const UserById = async (_id: UserId) => {
	try {
		const result = await db
			.select({
				_id: UserTable._id,
				name: UserTable.name,
				email: UserTable.email,
				password: UserTable.password,
				role: UserTable.role
			})
			.from(UserTable)
			.where(eq(UserTable._id, _id))
		return result[0]
	} catch (_) {
		throw { status: 500, message: "No se pudo obtener la información del usuario. Intente nuevamente más tarde." }
	}
}
