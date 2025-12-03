import type { UserTableType as User } from "../db/schema"

export const userRoleValues = ["admin", "user"] as const
export type UserRole = (typeof userRoleValues)[number]
export type UserJWT = Required<Pick<User, "_id" | "role">>

export type CreateUser = Pick<User, "name" | "email" | "password">
export type UpdateUser = Partial<Pick<User, "name" | "email" | "id_avatar">> & { user_id: string }
