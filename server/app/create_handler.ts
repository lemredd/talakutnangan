import "dotenv/config"
import express  from "express"

import type { RequestHandler } from "!/types/dependent"

import Router from "!/bases/router"
import catchAllErrors from "!/app/catch_all_errors"
import createViteDevServer from "!/vite_dev/create_server"
import manageAuthentication from "!/app/auth/manage_authentication"
import registerGlobalPostJobs from "!/app/register_global_post_jobs"
import registerGlobalMiddlewares from "!/app/register_global_middlewares"
import registerCustomValidators from "!/app/auth/register_custom_validators"

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

		const rawMiddlewares = middlewares
			.filter(middleware => middleware !== null)
			.map(middleware => middleware!.intermediate.bind(middleware))
		const rawPostJobs = postJobs
			.filter(postJob => postJob !== null)
			.map(postJob => postJob!.intermediate!.bind(postJob))
		const rawHandlers = [ ...rawMiddlewares, controller, ...rawPostJobs, endHandler ]
			.filter(middleware => middleware !== null)

		app[method](path, ...(<RequestHandler[]><unknown>rawHandlers))
	}

	await registerGlobalPostJobs(app)

	app.use(viteDevRouter)

	// @ts-ignore
	app.use(catchAllErrors)

	return app
}
