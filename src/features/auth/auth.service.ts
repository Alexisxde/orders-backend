import bcrypt from "bcrypt"
import ImageService from "../../features/image/image.service"
import prisma from "../../modules/prisma"
import type { RegisterUser, UpdateUser } from "./auth.schema"
import type { User } from "./auth.type"

async function create({ name, email, password }: RegisterUser) {
	const SALT = 10
	const hashedPassword = (await bcrypt.hash(password, SALT)) as string
	const user = await prisma.user.findUnique({
		where: { email },
		select: { id: true, name: true, password: true, role: true }
	})
	if (user) throw { status: 409, error: "El usuario ya existe. Intentelo de nuevo con otro email." }

	const userCreated = await prisma.user.create({
		data: { name, email, password: hashedPassword },
		select: { id: true, name: true, email: true, role: true }
	})

	return userCreated
}

async function validate({ email, password }: Pick<User, "email" | "password">) {
	const user = await prisma.user.findUnique({
		where: { email },
		select: { id: true, name: true, password: true, role: true }
	})

	if (!user) throw { status: 404, error: "Usuario no encontrado. Por favor intentelo de nuevo." }
	const isValid = await bcrypt.compare(password, user.password)
	if (!isValid) throw { status: 404, error: "Las credenciales proporcionadas no son válidas." }
	if (!user) throw { status: 404, error: "Usuario no encontrado." }

	const { password: _, ...rest } = user
	return rest
}

async function getById({ userId }: { userId: string }) {
	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: {
			id: true,
			name: true,
			email: true,
			role: true,
			avatar: { select: { id: true, url: true } }
		}
	})

	if (!user) throw { status: 404, error: "Usuario no encontrado." }
	return user
}

async function update({ userId, data }: { userId: string; data: UpdateUser }) {
	let avatar: { id: string; url: string } | null = null
	const { name, file } = data

	if (file) avatar = await ImageService.insert({ file, userId })

	const user = await prisma.user.update({
		where: { id: userId },
		data: { name, avatarId: avatar?.id },
		select: {
			id: true,
			name: true,
			email: true,
			role: true,
			avatar: { select: { id: true, url: true } }
		}
	})

	if (!user) throw { status: 404, error: "Usuario no encontrado." }
	return user
}

export default { create, validate, getById, update }
