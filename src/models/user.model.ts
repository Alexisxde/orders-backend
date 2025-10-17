import bcrypt from "bcrypt"
import { NODE_ENV } from "../config"
import db from "../db/db"
import { UserTable } from "../db/schema"
import type { UserCreate } from "../types/auth"

const SALT = NODE_ENV === "production" ? 10 : 2

export const createUser = async ({ name, email, password }: UserCreate) => {
	const _id = crypto.randomUUID()
	try {
		const hashedPassword = (await bcrypt.hash(password, SALT)) as string
		const result = await db.insert(UserTable).values({ _id, name, email, password: hashedPassword })
		return result.rows
	} catch (_) {}
}

// export const allUser = async () => {}

// export const getUserByEmail = async (email) => {}

// export const UserById = async (id) => {}

// export const deleteUser = async (id) => {}
