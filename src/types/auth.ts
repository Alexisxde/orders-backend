import type { UserTableType } from "../db/schema"

export const userRoleValues = ["admin", "user"] as const

export type User = UserTableType
export type UserId = User["_id"]
export type UserEmail = User["email"]
export type UserRole = (typeof userRoleValues)[number]

export type UserCreate = Pick<User, "name" | "email" | "password">
export type UserLogin = Pick<User, "email" | "password">

export type UserJWT = { _id: UserId; role: UserRole }
export type UserToken = {
	_id: UserId
	name: string
	email: string
	role: UserRole
	id_avatar?: string | null
}
