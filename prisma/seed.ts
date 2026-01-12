import "dotenv/config"
import prisma from "../src/services/prisma"

async function main() {
	const user = await prisma.user.upsert({
		where: { email: "user@user.com" },
		update: {},
		create: {
			name: "User",
			email: "user@user.com",
			password: "$2b$10$fW6dSP9Nw2mUvpFdA0J0LOGCHH4CMqgSUK88qXzfaXOjB7CiFFUoW"
		}
	})
	// biome-ignore lint/suspicious/noConsole: Permitido para migrar usuario.
	console.log("✅ Usuario creado")

	const avatar = await prisma.image.upsert({
		where: { userId: user.id },
		update: {},
		create: {
			cloudId: "dcbjswtbrziln4awz4a9",
			url: "https://res.cloudinary.com/dzfntog8k/image/upload/v1762300789/dcbjswtbrziln4awz4a9.jpg",
			user: {
				connect: { id: user.id }
			}
		}
	})
	// biome-ignore lint/suspicious/noConsole: Permitido para migrar avatar.
	console.log("✅ Avatar creado")

	await prisma.user.update({
		where: { id: user.id },
		data: { avatarId: avatar.id }
	})
	// biome-ignore lint/suspicious/noConsole: Permitido para migrar avatar.
	console.log("✅ Avatar asignado al usuario")
}

main()
	.catch((e) => {
		// biome-ignore lint/suspicious/noConsole: Permitido para mirar errores.
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
