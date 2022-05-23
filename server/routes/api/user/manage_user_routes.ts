import { EntityManager } from "typeorm"
import { Router as createRouter } from "express"

import { Routers } from "!/types"
import makeGetCreateRoute from "!/routes/api/user/create.get"
import makePostLogInRoute from "!/routes/api/user/log_in.post"
import createGuestGuard from "!/middlewares/create_guest_guard"
import makePostLogOutRoute from "!/routes/api/user/log_out.post"
import makePostRegisterRoute from "!/routes/api/user/register.post"
import createJSONBodyParser from "!/middlewares/create_json_body_parser"
import createAuthorizationGuard from "!/middlewares/create_authorization_guard"

export default function(manager: EntityManager): Routers {
	const prefix = "/user"
	const main = createRouter()
	const authenticatedRouter = createRouter()
	const guestRouter = createRouter()

	main.get(`${prefix}/create`, makeGetCreateRoute(manager));

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
	authenticatedRouter.post(`${prefix}/log_out`, makePostLogOutRoute());

	main.use(guestRouter)
	main.use(authenticatedRouter)
	return { main }
}
