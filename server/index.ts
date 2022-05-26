import "reflect-metadata"
import "dotenv/config"

import { Server as HTTPServer } from "http"

import type { SourceType } from "!/types"
import createWSServer from "!/ws/create_server"
import manageRoutes from "!/routes/manage_routes"
import createAppHandler from "!/app/create_handler"
import createDataSource from "!/data_source/create_source"
import initializeSingletons from "!/helpers/initialize_singletons"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"

startServer()

async function startServer() {
	const dataSource = await createDataSource(process.env.DATABASE_TYPE as SourceType)
	const manager = dataSource.manager

	initializeSingletons(manager)
	const customRoutes = manageRoutes(manager)

	const app = await createAppHandler(manager, customRoutes)
	const httpServer = new HTTPServer(app)
	const _wsServer = createWSServer(httpServer)

	const port = process.env.WEB_PORT || 3000
	httpServer.listen(port)
	console.log(`Server running at http://localhost:${port}`)
}
