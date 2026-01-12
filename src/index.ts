import "dotenv/config"
import type { NextFunction, Request, Response } from "express"
import { API_URL, PORT } from "./config"
import AuthRouter from "./features/auth/auth.route"
import ProductRouter from "./features/product/product.route"
import SessionMiddleware from "./middlewares/session.middleware"
import { app, server } from "./server"
import type { HttpError } from "./types/error"
import { INTERNAL_SERVER_ERROR, OK } from "./utils/http-status-code"

app.get("/", (_, res) => {
	res.status(OK).json({ url: `${API_URL}:${PORT}`, status: "API is running" })
})

app.use("/api/auth", AuthRouter)
app.use("/api/products", SessionMiddleware, ProductRouter)
app.use((err: HttpError, _req: Request, res: Response, _next: NextFunction) => {
	res.status(err.status || INTERNAL_SERVER_ERROR).json({ success: false, error: err.error || "Internal Server Error" })
})

server.listen(PORT, () => {
	// biome-ignore lint/suspicious/noConsole: Permitido para mirar el servidor.
	console.log(`[server]: ${API_URL}:${PORT}`)
})
