import type { InferModel } from "drizzle-orm"
import type { UserTable } from "./../db/schema"

export type User = InferModel<typeof UserTable>
export type UserId = User["_id"]
export type UserName = User["name"]
export type UserEmail = User["email"]
export type UserPassword = User["password"]
export type UserRole = User["role"]

export type UserCreate = Pick<User, "name" | "email" | "password">
export type UserLogin = Pick<User, "email" | "password">
export type UserToken = Omit<User, "password" | "created_at">
