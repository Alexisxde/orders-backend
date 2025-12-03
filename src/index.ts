import "dotenv/config"
import { API_URL, PORT } from "./config"
import { verifySession } from "./middlewares/verify-session"
import authRouter from "./routes/auth.route"
import orderRouter from "./routes/order.route"
import productRouter from "./routes/product.route"
import reportRouter from "./routes/report.route"
import { app, server } from "./server"

app.get("/", (_, res) => {
	res.status(200).json({ url: `${API_URL}:${PORT}`, status: "API is running" })
})

app.use("/api/auth", authRouter)
app.use("/api/products", verifySession, productRouter)
app.use("/api/orders", verifySession, orderRouter)
app.use("/api/reports", verifySession, reportRouter)

server.listen(PORT, () => {
	// biome-ignore lint/suspicious/noConsole: Permitido para mirar el servidor.
	console.log(`[server]: ${API_URL}:${PORT}`)
})
