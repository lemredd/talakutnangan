import "dotenv/config"
import express from "express"

import type { Method } from "$/types/server"
import type { RequestHandler } from "!/types/dependent"

import Log from "$!/singletons/log"
import Router from "!/bases/router"
import Middleware from "!/bases/middleware"
import catchAllErrors from "!/app/catch_all_errors"
import createViteDevServer from "!/vite_dev/create_server"
import makeGlobalPostJobs from "!/app/make_global_post_jobs"
import manageAuthentication from "!/app/manage_authentication"
import registerGlobalMiddlewares from "!/app/register_global_middlewares"

export default async function(
	customRoutes: Router,
	{
		dependentProcess = Promise.resolve()
	}: Partial<{
		dependentProcess: Promise<void>
	}> = {}
): Promise<express.Express> {
	const app = express()
	app.set("trust proxy", true)

	const viteDevRouter = await createViteDevServer(app)

	await Promise.all([
		dependentProcess.then(() => registerGlobalMiddlewares(app)),
		manageAuthentication()
	])

	const globalPostJobs = await makeGlobalPostJobs()
	const rawGlobalPostJobs = globalPostJobs
	.filter(postJob => postJob !== null)
	.map((postJob: Middleware) => postJob.intermediate.bind(postJob))
	let routeCount = 0

	const allRouteInformation = await customRoutes.allUsableRoutes
	const registrationProcess: Promise<{
		method: Method,
		path: string,
		handlers: RequestHandler[]
	}>[] = []

	for (const { information, handlers } of allRouteInformation) {
		registrationProcess.push(new Promise(resolve => {
			const { method, path } = information
			const { middlewares, controller, postJobs, endHandler } = handlers

			const rawMiddlewares = middlewares
			.filter(middleware => middleware !== null)
			.map(middleware => {
				const castMiddleware = middleware as Middleware
				return castMiddleware.intermediate.bind(middleware)
			})
			const rawPostJobs = postJobs
			.filter(postJob => postJob !== null)
			.map(postJob => {
				const castPostJob = postJob as Middleware
				return castPostJob.intermediate.bind(postJob)
			})
			const rawHandlers = [
				...rawMiddlewares,
				controller,
				...rawPostJobs,
				...rawGlobalPostJobs,
				endHandler
			]
			.filter(middleware => middleware !== null)

			resolve({
				"handlers": <RequestHandler[]><unknown>rawHandlers,
				method,
				path
			})
		}))
	}

	await Promise.all(registrationProcess).then(results => {
		results.forEach(({ method, path, handlers }) => {
			app[method](path, ...handlers)
			routeCount++
		})

		Log.success("server", `registered ${routeCount} routes with different types`)
	})

	app.use(viteDevRouter)

	// @ts-ignore
	app.use(catchAllErrors)

	return app
}
