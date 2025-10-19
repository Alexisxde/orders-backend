import type { InferModel } from "drizzle-orm"
import type { UserTable } from "./../db/schema"

export type User = InferModel<typeof UserTable>
export type UserId = User["_id"]
export type UserName = User["name"]
export type UserEmail = User["email"]
export type UserPassword = User["password"]
export type UserRole = User["role"]

export interface UserCreate {
	name: UserName
	email: UserEmail
	password: UserPassword
}

export interface UserLogin {
	email: UserEmail
	password: UserPassword
}
