import createSession from "./create_session"
import createCompression from "./create_compression"
import createAuthentication from "./create_authentication"
import type { Express as ExpressApp } from "express"

export default async function(app: ExpressApp) {
	const middlewares = [
		createCompression(),
		createSession(),
		...createAuthentication()
	]

	middlewares.forEach(middleware => {
		app.use(middleware)
	})
}
