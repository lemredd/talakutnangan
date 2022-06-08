import "reflect-metadata"
import "dotenv/config"

import { Server as HTTPServer } from "http"

import createWSServer from "!/ws/create_server"
import Router from "!/app/routes/router_manager"
import createAppHandler from "!/app/create_handler"
import initializeSingletons from "!/helpers/initialize_singletons"

import { SourceType } from "%/types"
import createDataSource from "%/data_source/create_source"

startServer()

async function startServer() {
	const _dataSource = await createDataSource(process.env.DATABASE_TYPE as SourceType)

	initializeSingletons()
	const customRouter = new Router()

	const app = await createAppHandler(customRouter)
	const httpServer = new HTTPServer(app)
	const _wsServer = createWSServer(httpServer)

	const port = process.env.WEB_PORT || 3000
	httpServer.listen(port)
	console.log(`Server running at http://localhost:${port}`)
}
