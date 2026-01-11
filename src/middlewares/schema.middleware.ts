import type { NextFunction, Request, Response } from "express"
import type { AnyZodObject, ZodEffects } from "zod"

export const schemaBodyValidator =
	(schema: AnyZodObject | ZodEffects<AnyZodObject>) => (req: Request, res: Response, next: NextFunction) => {
		const { success, error } = schema.safeParse(req.body)
		if (!success) {
			return res.status(400).json({
				success: false,
				error: error.errors.map((err) => ({
					field: err.path[0],
					message: err.message
				}))
			})
		}
		next()
	}

export const schemaQuerysValidator =
	(schema: AnyZodObject | ZodEffects<AnyZodObject>) => (req: Request, res: Response, next: NextFunction) => {
		const { success, error } = schema.safeParse(req.query)
		if (!success) {
			return res.status(400).json({
				success: false,
				error: error.errors.map((err) => ({
					param: err.path[0],
					message: err.message
				}))
			})
		}
		next()
	}

export default { body: schemaBodyValidator, query: schemaQuerysValidator }
