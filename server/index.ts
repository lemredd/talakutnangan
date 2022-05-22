import "reflect-metadata"
import "dotenv/config"

import express from "express"
import { Server as HTTPServer } from "http"

import type { SourceType } from "!/types"
import createWSServer from "!/ws/create_server"
import manageRoutes from "!/routes/manage_routes"
import createDataSource from "!/create_data_source"
import createViteDevServer from "!/vite_dev/create_server"
import manageAuthentication from "!/auth/manage_authentication"
import registerGlobalMiddlewares from "!/middlewares/register_global_middlewares"

const isProduction = process.env.NODE_ENV === "production"
const root = `${__dirname}/..`

startServer()

async function startServer() {
	const app = express()

	const dataSource = await createDataSource(process.env.DATABASE_TYPE as SourceType)
	const manager = dataSource.manager

	const httpServer = new HTTPServer(app)
	const {
		viteDevServer: _viteDevServer,
		registerUIRoutes
	} = await createViteDevServer(app, isProduction, root)
	const _wsServer = createWSServer(httpServer)

	await registerGlobalMiddlewares(app)
	await manageAuthentication(manager)
	app.use(manageRoutes(manager))
	registerUIRoutes()

	const port = process.env.WEB_PORT || 3000
	httpServer.listen(port)
	console.log(`Server running at http://localhost:${port}`)
}
