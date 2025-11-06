import bcrypt from "bcrypt"
import "dotenv/config"
import type { User } from "../types/auth"
import type { Image, UserImage } from "../types/image"
import type { Order, OrderDetails } from "../types/order"
import type { Product } from "../types/product"
import db from "./db"
import { ImagesTable, OrdersDetailsTable, OrdersTable, ProductsTable, UserImagesTable, UserTable } from "./schema"

const IMAGES = [
	{
		_id: "dcbjswtbrziln4awz4a9",
		url: "https://res.cloudinary.com/dzfntog8k/image/upload/v1762300789/dcbjswtbrziln4awz4a9.jpg"
	},
	{
		_id: "mxarf0aku4ub1b9sjqoa",
		url: "https://res.cloudinary.com/dzfntog8k/image/upload/v1762293853/mxarf0aku4ub1b9sjqoa.jpg"
	}
] as Image[]

const USER_IMAGES = [
	{
		_id: "c6295c63-d25c-4a0f-9881-f3171b888d3b",
		image_id: "dcbjswtbrziln4awz4a9",
		user_id: "c7150dab-216d-43b6-8c89-0e22c5e2a06d"
	},
	{
		_id: "c7150dab-216d-43b6-8c89-0e22c5e2a06d",
		image_id: "mxarf0aku4ub1b9sjqoa",
		user_id: "c7150dab-216d-43b6-8c89-0e22c5e2a06d"
	}
] as UserImage[]

const PRODUCTS = [
	{
		_id: "1be933f9-ee4a-49a1-8b50-310dd0bb8961",
		name: "Hamburguesa Especial",
		description: "Deliciosa hamburguesa con ingredientes frescos y una salsa especial.",
		unit_price: "10000",
		image_id: "c7150dab-216d-43b6-8c89-0e22c5e2a06d",
		user_id: "c7150dab-216d-43b6-8c89-0e22c5e2a06d"
	}
] as Product[]

const USERS = [
	{
		_id: "c7150dab-216d-43b6-8c89-0e22c5e2a06d",
		name: "User",
		email: "user@user.com",
		password: "User1234",
		role: "user",
		id_avatar: null
	},
	{
		_id: "1235678987654323678",
		name: "Admin",
		email: "admin@admin.com",
		password: "Admin1234",
		role: "admin",
		id_avatar: null
	}
] as User[]

const ORDERS = [
	{
		_id: "861be953-4bd0-447b-899d-a968720bee7d",
		payment_method: "mercado_pago",
		total: "20000",
		name: "Olivarez Jose",
		user_id: "c7150dab-216d-43b6-8c89-0e22c5e2a06d"
	}
] as Order[]

const ORDER_DETAILS = [
	{
		_id: "17083197-40ff-44ed-b4dd-ab72a3c27942",
		quantity: 2,
		price: "10000",
		observation: "Sin cebolla por favor",
		order_id: "861be953-4bd0-447b-899d-a968720bee7d",
		product_id: "1be933f9-ee4a-49a1-8b50-310dd0bb8961"
	}
] as OrderDetails[]

export const insertUsers = async () => {
	USERS.map(async ({ password, ...user }) => {
		await db.insert(UserTable).values({ ...user, password: await bcrypt.hash(password, 10) })
	})
}

export const insertImages = async () => {
	await db.insert(ImagesTable).values(IMAGES)
	await db.insert(UserImagesTable).values(USER_IMAGES)
}

export const insertProducts = async () => {
	await db.insert(ProductsTable).values(PRODUCTS)
}

export const insertOrders = async () => {
	await db.insert(OrdersTable).values(ORDERS)
	await db.insert(OrdersDetailsTable).values(ORDER_DETAILS)
}

const main = async () => {
	await insertUsers()
	// await insertImages()
	// await insertProducts()
	// await insertOrders()
}

main()
// biome-ignore lint/suspicious/noConsole: Permitido para verificar.
console.log("Seeded local.db!")
