import type { NextFunction, Request, Response } from "express"
import type { AnyZodObject, ZodEffects } from "zod"
import { BAD_REQUEST } from "../utils/http-status-code"

export const body =
	(schema: AnyZodObject | ZodEffects<AnyZodObject>) => (req: Request, res: Response, next: NextFunction) => {
		const { success, error } = schema.safeParse(req.body)
		if (!success) {
			return res.status(BAD_REQUEST).json({
				success: false,
				error: error.errors.map((err) => ({
					field: err.path[0],
					message: err.message
				}))
			})
		}
		next()
	}

export const query =
	(schema: AnyZodObject | ZodEffects<AnyZodObject>) => (req: Request, res: Response, next: NextFunction) => {
		const { success, error } = schema.safeParse(req.query)
		if (!success) {
			return res.status(BAD_REQUEST).json({
				success: false,
				error: error.errors.map((err) => ({
					param: err.path[0],
					message: err.message
				}))
			})
		}
		next()
	}

export default { body, query }
