import bcrypt from "bcrypt"
import { eq } from "drizzle-orm"
import { NODE_ENV } from "../config"
import db from "../db/db"
import { UserTable } from "../db/schema"
import type { UserCreate, UserEmail, UserId } from "../types/auth"

const SALT = NODE_ENV === "production" ? 10 : 2

export const createUser = async ({ name, email, password }: UserCreate) => {
	const _id = crypto.randomUUID()
	try {
		const hashedPassword = (await bcrypt.hash(password, SALT)) as string
		const result = await db.insert(UserTable).values({ _id, name, email, password: hashedPassword })
		return result.rows
	} catch (_) {}
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
	} catch (_) {}
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
	} catch (_) {}
}
