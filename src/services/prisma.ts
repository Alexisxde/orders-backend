import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "@prisma/client"
import { DATABASE_AUTH_TOKEN, DATABASE_URL } from "../config"

const adapter = new PrismaPg({
	url: DATABASE_URL,
	authToken: DATABASE_AUTH_TOKEN
})

export default new PrismaClient({ adapter })
