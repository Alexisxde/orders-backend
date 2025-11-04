import cookieParser from "cookie-parser"
import cors from "cors"
import express, { json } from "express"
import morgan from "morgan"
import { createServer } from "node:http"
import { Server } from "socket.io"
import "./config"

const app = express()
const server = createServer(app)
const io = new Server(server, { cors: { origin: ["http://localhost:3000", "http://localhost:4000"] } })

app.use([
	json(),
	cors({
		origin: ["http://localhost:3000", "http://localhost:4000"],
		credentials: true,
		methods: ["GET", "POST", "PUT", "DELETE"]
	}),
	morgan("dev"),
	cookieParser()
])

export { app, io, server }
