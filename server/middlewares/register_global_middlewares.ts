import createCompression from "./create_compression"
import type { Express as ExpressApp } from "express"

export default async function(app: ExpressApp) {
	const middlewares = [
		createCompression()
	]

	middlewares.forEach(middleware => {
		app.use(middleware)
	})
}
