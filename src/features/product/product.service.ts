import prisma from "../../services/prisma"
import type { CreateProduct, UpdateProduct } from "./product.types"

async function create(data: CreateProduct, userId: string) {
	const { name, price, category, description, imageId } = data
	const productCreated = await prisma.product.create({
		data: { name, price, category, description, imageId, userId },
		select: {
			id: true,
			name: true,
			price: true,
			category: true,
			description: true,
			image: { select: { id: true, url: true } }
		}
	})
	return productCreated
}

async function getAll(userId: string) {
	const products = await prisma.product.findMany({
		where: { userId },
		select: {
			id: true,
			name: true,
			price: true,
			category: true,
			description: true,
			disabled: true,
			image: { select: { id: true, url: true } }
		}
	})
	return products
}

async function getById(id: string, userId: string) {
	const product = await prisma.product.findFirst({
		where: { id, userId },
		select: {
			id: true,
			name: true,
			price: true,
			category: true,
			description: true,
			disabled: true,
			image: { select: { id: true, url: true } }
		}
	})
	return product
}

async function update(data: UpdateProduct, userId: string) {
	const { id, name, category, price, description, disabled } = data
	const productUpdated = await prisma.product.update({
		where: { id, userId },
		data: { name, category, price, description, disabled },
		select: {
			id: true,
			name: true,
			price: true,
			category: true,
			description: true,
			disabled: true,
			image: { select: { id: true, url: true } }
		}
	})
	return productUpdated
}

export default { create, getAll, getById, update }
