import { z } from "zod"

const envSchema = z.object({
	PORT: z.string().default("3000"),
	DATABASE_URL: z.string().default("file:src/db/local.db"),
	DATABASE_AUTH_TOKEN: z.string().optional(),
	FRONT_URL: z.string().default("http://localhost:3001"),
	NODE_ENV: z.string().default("production"),
	API_URL: z.string().default("http://localhost"),
	SSL_KEY: z.string().optional(),
	SSL_CERT: z.string().optional(),
	JWT_SECRET_REFRESHTOKEN: z.string(),
	JWT_SECRET: z.string(),
	CLOUDINARY_CLOUD_NAME: z.string(),
	CLOUDINARY_API_KEY: z.string(),
	CLOUDINARY_API_SECRET: z.string()
})

const { error, success, data } = envSchema.safeParse(process.env)

if (!success) {
	// biome-ignore lint/suspicious/noConsole: Permitido para verificar las variables en el servidor.
	console.error("❌ Error en las variables de entorno: ", error.format())
	process.exit(1)
}

declare global {
	namespace NodeJS {
		interface ProcessEnv extends z.infer<typeof envSchema> {}
	}
}

export const {
	PORT,
	DATABASE_AUTH_TOKEN,
	DATABASE_URL,
	FRONT_URL,
	API_URL,
	NODE_ENV,
	JWT_SECRET_REFRESHTOKEN,
	JWT_SECRET,
	CLOUDINARY_CLOUD_NAME,
	CLOUDINARY_API_KEY,
	CLOUDINARY_API_SECRET,
	SSL_KEY,
	SSL_CERT
} = data
