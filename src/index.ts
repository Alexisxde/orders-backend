import "dotenv/config"
import { API_URL, PORT } from "./config"
import { verifySession } from "./middlewares/verify-session"
import authRouter from "./routes/auth.route"
import imageRouter from "./routes/image.route"
import server from "./server"

server.get("/", (_, res) => {
	res.status(200).json({ url: API_URL })
})

server.use("/api/auth", authRouter)
server.use("/api/images", verifySession, imageRouter)

server.listen(PORT, () => {
	// biome-ignore lint/suspicious/noConsole: Permitido para mirar el servidor.
	console.log(`[server]: http://localhost:${PORT}`)
})
