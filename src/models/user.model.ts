import bcrypt from "bcrypt"
import { eq } from "drizzle-orm"
import db from "../db/db"
import { ImagesTable, UserTable } from "../db/schema"
import type { CreateUser, UpdateUser } from "../types/auth"

export async function createUser({ name, email, password }: CreateUser) {
	const SALT = 10
	const _id = crypto.randomUUID()

	const hashedPassword = (await bcrypt.hash(password, SALT)) as string
	const result = await db.insert(UserTable).values({ _id, name, email, password: hashedPassword }).returning()
	return result[0]
}

export async function getUserByEmail(email: string) {
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
}

export async function userById(_id: string) {
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
}

export async function updateUser(user: UpdateUser) {
	const { name, email, id_avatar, user_id } = user

	const [result] = await db
		.update(UserTable)
		.set({ name, email, id_avatar })
		.where(eq(UserTable._id, user_id))
		.returning({ _id: UserTable._id })
	const { password: _, ...data } = await userById(result._id)
	return data
}

export default { create: createUser, getByEmail: getUserByEmail, getById: userById, update: updateUser }
