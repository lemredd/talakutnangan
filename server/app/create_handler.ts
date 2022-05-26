import "dotenv/config"

import express from "express"
import { EntityManager } from "typeorm"

import manageRoutes from "!/routes/manage_routes"
import createViteDevServer from "!/app/vite_dev/create_server"
import manageAuthentication from "!/app/auth/manage_authentication"
import registerGlobalMiddlewares from "!/middlewares/register_global_middlewares"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"
import RequestEnvironment from "!/helpers/request_environment"

export default async function(manager: EntityManager): Promise<express.Express> {
	const app = express()

	RequestEnvironment.intialize(manager)
	new CommonMiddlewareList()

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
