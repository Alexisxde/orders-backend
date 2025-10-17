import "dotenv/config"
import { API_URL, PORT } from "./config"
import authRouter from "./routes/auth.route"
import server from "./server"

server.get("/", (_, res) => {
	res.status(200).json({ url: API_URL })
})

server.use("/api/auth", authRouter)

server.listen(PORT, () => {
	// biome-ignore lint/suspicious/noConsole: Permitido para mirar el servidor.
	console.log(`[server]: http://localhost:${PORT}`)
})
