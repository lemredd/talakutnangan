import type { Express as ExpressApp } from "express"

import type { RequestHandler } from "!/types/dependent"
import Session from "!/middlewares/miscellaneous/session"
import Compression from "!/middlewares/miscellaneous/compression"
import AuthenticationSession from "!/middlewares/authentication/session"
import AuthenticationInitializer from "!/middlewares/authentication/initializer"
import TransactionInitializer from "!/middlewares/miscellaneous/transaction_initializer"

export default async function(app: ExpressApp) {
	const middlewares = [
		new Compression(),
		// new TransactionInitializer(),
		new Session(),
		new AuthenticationInitializer(),
		new AuthenticationSession()
	]

	middlewares.forEach(middleware => {
		app.use(middleware.intermediate.bind(middleware) as unknown as RequestHandler)
	})
}
