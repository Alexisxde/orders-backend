import "dotenv/config"
import { API_URL, PORT } from "./config"
import { verifySession } from "./middlewares/verify-session"
import authRouter from "./routes/auth.route"
import imageRouter from "./routes/image.route"
import productRouter from "./routes/product.route"
import { app, server } from "./server"

app.get("/", (_, res) => {
	res.status(200).json({ url: API_URL })
})

//* @router
app.use("/api/auth", authRouter)
app.use("/api/product", verifySession, productRouter)
app.use("/api/images", verifySession, imageRouter)

server.listen(PORT, () => {
	// biome-ignore lint/suspicious/noConsole: Permitido para mirar el servidor.
	console.log(`[server]: http://localhost:${PORT}`)
})
