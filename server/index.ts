import "reflect-metadata"
import "dotenv/config"
import { Server as HTTPServer } from "http"
import express from "express"
import compression from "compression"
import type { SourceType } from "!/types"
import createDataSource from "!/create_data_source"
import createWSServer from "!/ws/create_server"
import createViteDevServer from "!/vite_dev/create_server"
import manageRoutes from "!/routes/manage_routes"

const isProduction = process.env.NODE_ENV === "production"
const root = `${__dirname}/..`

startServer()

async function startServer() {
	const app = express()

	app.use(compression())

	const port = process.env.WEB_PORT || 3000
	const httpServer = new HTTPServer(app)
	const {
		viteDevServer: _viteDevServer,
		registerUIRoutes
	} = await createViteDevServer(app, isProduction, root)
	const _wsServer = createWSServer(httpServer)

	const dataSource = await createDataSource(process.env.DATABASE_TYPE as SourceType)

	const manager = dataSource.manager

	app.use(manageRoutes(manager))
	registerUIRoutes()

	httpServer.listen(port)
	console.log(`Server running at http://localhost:${port}`)
}
