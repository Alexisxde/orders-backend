import type { User as UserPrisma } from "@prisma/client"

export type User = UserPrisma
export const userRoleValues = ["admin", "user"] as const
export type UserRole = (typeof userRoleValues)[number]
export type UserJWT = Required<Pick<User, "id" | "role">>
