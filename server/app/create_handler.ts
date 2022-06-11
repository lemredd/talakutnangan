import "dotenv/config"

import express  from "express"

import Router from "!/bases/router"
import createViteDevServer from "!/vite_dev/create_server"
import registerCustomValidators from "!/app/auth/register_custom_validators"
import manageAuthentication from "!/app/auth/manage_authentication"
import registerGlobalMiddlewares from "!/app/register_global_middlewares"

export default async function(customRoutes: Router): Promise<express.Express> {
	const app = express()

	const viteDevRouter = await createViteDevServer(app)

	await registerGlobalMiddlewares(app)
	await manageAuthentication()
	await registerCustomValidators()

	const allRouteInformation = customRoutes.allUsableRoutes
	for (const { information, handlers } of allRouteInformation) {
		const { method, path } = information
		const { middlewares, controller, postJobs, endHandler } = handlers

		const rawMiddlewares = middlewares.map(middleware => middleware.intermediate.bind(middleware))
		const rawPostJobs = postJobs.map(postJob => postJob.intermediate.bind(postJob))
		const rawHandlers = [ ...rawMiddlewares, controller, ...rawPostJobs ]

		if (endHandler !== null) {
			rawHandlers.push(endHandler)
		}

		app[method](path, ...rawHandlers)
	}

	app.use(viteDevRouter)

	return app
}
