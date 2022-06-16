import "reflect-metadata"
import "dotenv/config"

import { Server as HTTPServer } from "node:http"

import { SourceType } from "%/types/independent"

import Log from "!/helpers/log"
import createWSServer from "!/ws/create_server"
import Router from "!/app/routes/router"
import createAppHandler from "!/app/create_handler"
import initializeSingletons from "!/helpers/initialize_singletons"

startServer()

async function startServer() {
	initializeSingletons(process.env.DATABASE_TYPE as SourceType)

	const customRouter = new Router()

	const app = await createAppHandler(customRouter)
	const httpServer = new HTTPServer(app)
	const _wsServer = createWSServer(httpServer)

	const port = process.env.WEB_PORT || 3000
	httpServer.listen(port)
	Log.success("server", `HTTP server running at http://localhost:${port}`)
}
