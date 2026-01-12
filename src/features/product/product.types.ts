export const CategoriesValues = ["others"] as const
export type Categories = (typeof CategoriesValues)[number]

export type CreateProduct = {
	name: string
	price: number
	category: Categories
	description?: string
	imageId: string
}

export type UpdateProduct = {
	id: string
	name?: string
	category?: Categories
	price?: number
	description?: string
	imageId?: string
	disabled?: boolean
}
