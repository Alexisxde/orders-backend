import type { UserTableType as User } from "../db/schema"

export const userRoleValues = ["admin", "user"] as const
export type UserId = User["_id"]
export type UserRole = (typeof userRoleValues)[number]
export type UserCreate = Pick<User, "name" | "email" | "password">
export type UserLogin = Pick<User, "email" | "password">
export type UserJWT = Required<Pick<User, "_id" | "role">>
export type UserToken = Required<Pick<User, "_id" | "name" | "email" | "role" | "id_avatar">>
