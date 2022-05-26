import passport from "passport"
import { EntityManager } from "typeorm"
import { Router as createRouter } from "express"

import { Routers } from "!/types"
import createAuthorizationGuard from "!/middlewares/create_authorization_guard"

import makePatchUpdateRoute from "!/routes/api/user/update.patch"
import Router from "!/routes/api/user/router"

export default function(manager: EntityManager): Routers {
	const newMain = new Router()

	const prefix = "/user"
	const main = createRouter()

	main.use(newMain.routers.prefixedRouter)

	main.patch(
		`${prefix}/update/:id`,
		createAuthorizationGuard(null),
		makePatchUpdateRoute(manager)
	)

	return { main }
}
