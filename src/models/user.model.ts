import bcrypt from "bcrypt"
import { eq } from "drizzle-orm"
import db from "../db/db"
import { ImagesTable, UserTable } from "../db/schema"
import type { UserCreate } from "../types/auth"

export async function createUser({ name, email, password }: UserCreate) {
	const SALT = 10
	const _id = crypto.randomUUID()

	try {
		const hashedPassword = (await bcrypt.hash(password, SALT)) as string
		const result = await db.insert(UserTable).values({ _id, name, email, password: hashedPassword }).returning()
		return result[0]
	} catch (_) {
		throw {
			status: 500,
			error: "No se pudo guardar la información en la base de datos. Intente nuevamente más tarde."
		}
	}
}

export async function getUserByEmail(email: string) {
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
		throw { status: 500, error: "No se pudo obtener la información del usuario. Intente nuevamente más tarde." }
	}
}

export async function UserById(_id: string) {
	try {
		const result = await db
			.select({
				_id: UserTable._id,
				name: UserTable.name,
				email: UserTable.email,
				password: UserTable.password,
				role: UserTable.role,
				avatar: ImagesTable.url
			})
			.from(UserTable)
			.where(eq(UserTable._id, _id))
			.leftJoin(ImagesTable, eq(UserTable.id_avatar, ImagesTable._id))
		return result[0]
	} catch (_) {
		throw { status: 500, error: "No se pudo obtener la información del usuario. Intente nuevamente más tarde." }
	}
}

export async function updateUser({
	name,
	email,
	id_avatar,
	user_id
}: {
	name?: string
	email?: string
	id_avatar?: string
	user_id: string
}) {
	try {
		const [result] = await db
			.update(UserTable)
			.set({ name, email, id_avatar })
			.where(eq(UserTable._id, user_id))
			.returning({ _id: UserTable._id })
		const { password: _, ...user } = await UserById(result._id)
		return user
	} catch (_) {
		throw {
			status: 500,
			error: "No se pudo actualizar la información en la base de datos. Intente nuevamente más tarde."
		}
	}
}

export default { create: createUser, getByEmail: getUserByEmail, getById: UserById, update: updateUser }
