import "dotenv/config"

import express from "express"
import { EntityManager } from "typeorm"

import manageRoutes from "!/routes/manage_routes"
import createViteDevServer from "!/vite_dev/create_server"
import manageAuthentication from "!/app/auth/manage_authentication"
import registerGlobalMiddlewares from "!/app/register_global_middlewares"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"
import RequestEnvironment from "!/helpers/request_environment"

export default async function(manager: EntityManager): Promise<express.Express> {
	const app = express()

	RequestEnvironment.intialize(manager)
	new CommonMiddlewareList()

	const viteDevRouter = await createViteDevServer(app)

	await registerGlobalMiddlewares(app)
	await manageAuthentication(manager)
	app.use(manageRoutes(manager))
	app.use(viteDevRouter)

	return app
}
