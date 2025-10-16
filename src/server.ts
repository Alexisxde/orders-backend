import "@/config"
import cors from "cors"
import express, { json } from "express"
import morgan from "morgan"

const server = express()
server.use([json(), cors(), morgan("dev")])

export default server
