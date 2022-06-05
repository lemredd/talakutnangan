import type { Express as ExpressApp } from "express"

import Session from "!/middlewares/miscellaneous/session"
import Compression from "!/middlewares/miscellaneous/compression"
import AuthenticationSession from "!/middlewares/authentication/session"
import AuthenticationInitializer from "!/middlewares/authentication/initializer"

export default async function(app: ExpressApp) {
	const middlewares = [
		new Compression(),
		new Session(),
		new AuthenticationInitializer(),
		new AuthenticationSession()
	]

	middlewares.forEach(middleware => {
		app.use(...middleware.generateHandlers())
	})
}
