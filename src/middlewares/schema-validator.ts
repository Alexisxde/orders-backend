import type { NextFunction, Request, Response } from "express"
import type { AnyZodObject } from "zod"

export const schemaBodyValidator = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
	const { success, error } = schema.safeParse(req.body)
	if (!success) {
		return res.status(400).json({
			errors: error.errors.map((err) => ({
				field: err.path[0],
				message: err.message
			}))
		})
	}
	next()
}

export const schemaQueryValidator = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
	const { success, error } = schema.safeParse(req.query)
	if (!success) {
		return res.status(400).json({
			errors: error.errors.map((err) => ({
				field: err.path[0],
				message: err.message
			}))
		})
	}
	next()
}
