import createCompression from "./create_compression"
import createSession from "./create_session"
import type { Express as ExpressApp } from "express"

export default async function(app: ExpressApp) {
	const middlewares = [
		createCompression(),
		createSession()
	]

	middlewares.forEach(middleware => {
		app.use(middleware)
	})
}
