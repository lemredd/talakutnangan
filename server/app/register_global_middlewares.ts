import type { Express as ExpressApp } from "express"
import type { RequestHandler } from "!/types/dependent"

import makeGlobalMiddlewares from "!/helpers/make_global_middlewares"

// eslint-disable-next-line require-await
export default async function(app: ExpressApp): Promise<void> {
	const middlewares = makeGlobalMiddlewares()

	middlewares.forEach(middleware => {
		app.use(middleware.intermediate.bind(middleware) as unknown as RequestHandler)
	})
}
