import type { NextFunction, Request, Response } from "express"

export const authUser = (req: Request, res: Response, next: NextFunction) => {
	if (!req.body.user) return res.status(401).json({ error: "Unauthorized" })
	next()
}
