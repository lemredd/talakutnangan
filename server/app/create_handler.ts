import "dotenv/config"

import express from "express"
import { EntityManager } from "typeorm"

import createViteDevServer from "!/vite_dev/create_server"
import manageAuthentication from "!/app/auth/manage_authentication"
import registerGlobalMiddlewares from "!/app/register_global_middlewares"

export default async function(
	manager: EntityManager,
	customRoutes: express.Router
): Promise<express.Express> {
	const app = express()

	const viteDevRouter = await createViteDevServer(app)

	await registerGlobalMiddlewares(app)
	await manageAuthentication(manager)
	app.use(customRoutes)
	app.use(viteDevRouter)

	return app
}
