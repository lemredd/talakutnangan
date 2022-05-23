import { EntityManager } from "typeorm"
import { Router as createRouter } from "express"

import { Routers } from "!/types"
import createGuestGuard from "!/middlewares/create_guest_guard"
import createJSONBodyParser from "!/middlewares/create_json_body_parser"
import createAuthorizationGuard from "!/middlewares/create_authorization_guard"

import makeGetListRoute from "!/routes/api/user/list.get"
import makeGetCreateRoute from "!/routes/api/user/create.get"
import makePostLogInRoute from "!/routes/api/user/log_in.post"
import makePostLogOutRoute from "!/routes/api/user/log_out.post"
import makePatchUpdateRoute from "!/routes/api/user/update.patch"
import makePostRegisterRoute from "!/routes/api/user/register.post"

export default function(manager: EntityManager): Routers {
	const prefix = "/user"
	const main = createRouter()
	const authenticatedRouter = createRouter()
	const guestRouter = createRouter()

	main.get(`${prefix}/create`, makeGetCreateRoute(manager))

	guestRouter.use(createGuestGuard())
	guestRouter.use(createJSONBodyParser())
	guestRouter.post(
		`${prefix}/log_in`,
		makePostLogInRoute(manager)
	);
	guestRouter.post(
		`${prefix}/register`,
		makePostRegisterRoute(manager)
	);

	authenticatedRouter.use(createAuthorizationGuard(null))
	authenticatedRouter.post(`${prefix}/log_out`, makePostLogOutRoute())
	authenticatedRouter.get(`${prefix}/list`, makeGetListRoute(manager))
	authenticatedRouter.get(`${prefix}/update/:id`, makePatchUpdateRoute(manager))

	main.use(guestRouter)
	main.use(authenticatedRouter)
	return { main }
}
