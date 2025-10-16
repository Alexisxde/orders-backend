import { z } from "zod"

const envSchema = z.object({
	PORT: z.string().default("3000"),
	DATABASE_AUTH_TOKEN: z.string(),
	DATABASE_URL: z.string().url(),
	NODE_ENV: z.string().default("development"),
	API_URL: z.string().default("http://localhost:3000")
})

const { error, success, data } = envSchema.safeParse(process.env)

if (!success) {
	console.error("❌ Error en las variables de entorno: ", error.format())
	process.exit(1)
}

declare global {
	namespace NodeJS {
		interface ProcessEnv extends z.infer<typeof envSchema> {}
	}
}

export const { PORT, DATABASE_AUTH_TOKEN, DATABASE_URL, API_URL, NODE_ENV } = data
