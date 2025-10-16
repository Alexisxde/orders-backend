import { API_URL, PORT } from "@/config"
import server from "@/server"
import "dotenv/config"

server.get("/", (_, res) => {
	res.status(200).json({ url: API_URL })
})

server.listen(PORT, () => {
	console.log(`[server]: http://localhost:${PORT}`)
})
