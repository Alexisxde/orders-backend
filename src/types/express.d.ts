import type { UserToken } from "./auth"

declare global {
	namespace Express {
		interface Request {
			user?: UserToken | undefined
		}
	}
}
