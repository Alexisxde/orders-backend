import cookieParser from "cookie-parser"
import cors from "cors"
import express, { json } from "express"
import morgan from "morgan"
import fs from "node:fs"
import { createServer as createServerHttp } from "node:http"
import { createServer as createServerHttps } from "node:https"
import "./config"
import { SSL_CERT, SSL_KEY } from "./config"

const app = express()
const options = SSL_KEY && SSL_CERT ? { key: fs.readFileSync(SSL_KEY), cert: fs.readFileSync(SSL_CERT) } : {}
const server = SSL_KEY && SSL_CERT ? createServerHttps(options, app) : createServerHttp(app)

app.use([
	json(),
	cors({
		origin: ["http://192.168.1.21:3000", "http://localhost:3000"],
		credentials: true,
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type"]
	}),
	morgan("dev"),
	cookieParser()
])

export { app, server }
