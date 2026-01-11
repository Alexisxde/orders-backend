import { PrismaLibSql } from "@prisma/adapter-libsql"
import { PrismaClient } from "@prisma/client"
import { DATABASE_AUTH_TOKEN, DATABASE_URL } from "../config"

const adapter = new PrismaLibSql({ url: DATABASE_URL, authToken: DATABASE_AUTH_TOKEN })

export default new PrismaClient({ adapter })
