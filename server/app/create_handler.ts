import "dotenv/config"

import express from "express"

import createViteDevServer from "!/vite_dev/create_server"
import manageAuthentication from "!/app/auth/manage_authentication"
import registerGlobalMiddlewares from "!/app/register_global_middlewares"

export default async function(customRoutes: express.Router): Promise<express.Express> {
	const app = express()

	const viteDevRouter = await createViteDevServer(app)

	await registerGlobalMiddlewares(app)
	await manageAuthentication()
	app.use(customRoutes)
	app.use(viteDevRouter)

	return app
}
