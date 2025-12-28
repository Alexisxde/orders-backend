import cookieParser from "cookie-parser"
import cors from "cors"
import express, { json } from "express"
import morgan from "morgan"
import { createServer } from "node:http"
import "./config"
import { FRONT_URL } from "./config"
import Multer from "./middlewares/multer.middleware"

const app = express()
const server = createServer(app)

app.use(json())
app.use(
	cors({
		origin: [FRONT_URL, "http://localhost:3000"],
		credentials: true,
		methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type"]
	})
)
app.use(morgan("dev"))
app.use(cookieParser())
app.use(Multer.single("file"))

export { app, server }
