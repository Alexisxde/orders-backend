import type { NextFunction, Request, Response } from "express"
import ImageService from "../../features/image/image.service"
import { CREATED, OK } from "../../utils/http-status-code"
import type { UserJWT } from "../auth/auth.types"
import type { CreateProductDto, UpdateProductDto } from "./product.schema"
import ProductService from "./product.service"

export async function create(req: Request, res: Response, next: NextFunction) {
	const { id: userId } = req.body.user as UserJWT
	const { name, price, category, description } = req.body as CreateProductDto
	const file = req.file

	try {
		const { id: imageId } = await ImageService.insert({ file, userId })
		const data = await ProductService.create({ name, price, category, description, imageId }, userId)
		res.status(CREATED).json({ success: true, data, error: null })
	} catch (err) {
		next(err)
	}
}

export async function getAll(req: Request, res: Response, next: NextFunction) {
	const { id: userId } = req.body.user as UserJWT

	try {
		const data = await ProductService.getAll(userId)
		res.status(OK).json({ success: true, data, error: null })
	} catch (err) {
		next(err)
	}
}

export async function getById(req: Request, res: Response, next: NextFunction) {
	const { id: userId } = req.body.user as UserJWT
	const { id } = req.params as { id: string }

	try {
		const data = await ProductService.getById(id, userId)
		res.status(OK).json({ success: true, data, error: null })
	} catch (err) {
		next(err)
	}
}

export async function update(req: Request, res: Response, next: NextFunction) {
	const { id: userId } = req.body.user as UserJWT
	const { id } = req.params as { id: string }
	const { name, category, price, description, disabled } = req.body as UpdateProductDto
	// const file = req.file

	try {
		// ? Implementar el update de la imagen si es que se envia una nueva y eliminar la anterior y pasarle a update el imageId.
		// const { id: imageId } = await ImageService.update({ file, userId })
		const data = await ProductService.update({ id, name, category, price, description, disabled }, userId)
		res.status(OK).json({ success: true, data, error: null })
	} catch (err) {
		next(err)
	}
}

export default { create, getAll, getById, update }
