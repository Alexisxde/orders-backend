import cookieParser from "cookie-parser"
import cors from "cors"
import express, { json } from "express"
import morgan from "morgan"
import "./config"

const server = express()

server.use([
	json(),
	cors({
		origin: ["http://localhost:3000", "http://localhost:4000"],
		credentials: true,
		methods: ["GET", "POST", "PUT", "DELETE"]
	}),
	morgan("dev"),
	cookieParser()
])

export default server
