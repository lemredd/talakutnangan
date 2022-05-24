import "reflect-metadata"
import "dotenv/config"

import { Server as HTTPServer } from "http"

import type { SourceType } from "!/types"
import createWSServer from "!/ws/create_server"
import createDataSource from "!/create_data_source"
import createAppHandler from "!/app/create_handler"

startServer()

async function startServer() {
	const dataSource = await createDataSource(process.env.DATABASE_TYPE as SourceType)
	const manager = dataSource.manager

	const app = await createAppHandler(manager)
	const httpServer = new HTTPServer(app)
	const _wsServer = createWSServer(httpServer)

	const port = process.env.WEB_PORT || 3000
	httpServer.listen(port)
	console.log(`Server running at http://localhost:${port}`)
}
