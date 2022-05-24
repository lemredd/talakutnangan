import "dotenv/config"

import express from "express"
import { EntityManager } from "typeorm"

import manageRoutes from "!/routes/manage_routes"
import createViteDevServer from "!/vite_dev/create_server"
import manageAuthentication from "!/auth/manage_authentication"
import registerGlobalMiddlewares from "!/middlewares/register_global_middlewares"

export default async function(manager: EntityManager): Promise<express.Express> {
	const app = express()

	const {
		viteDevServer: _viteDevServer,
		registerUIRoutes
	} = await createViteDevServer(app)

	await registerGlobalMiddlewares(app)
	await manageAuthentication(manager)
	app.use(manageRoutes(manager))
	registerUIRoutes()

	return app
}
