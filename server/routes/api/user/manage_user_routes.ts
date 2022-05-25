import passport from "passport"
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
import makeGetLogInFailureRoute from "!/routes/api/user/log_in_failure.get"

export default function(manager: EntityManager): Routers {
	const prefix = "/user"
	const main = createRouter()

	main.get(`${prefix}/create`, makeGetCreateRoute(manager))

	main.post(
		`${prefix}/log_in`,
		createGuestGuard(),
		createJSONBodyParser(),
		passport.authenticate("local", { failureRedirect: "/api/user/log_in_failure" }),
		makePostLogInRoute(manager)
		);
		main.get(
			`${prefix}/log_in_failure`,
			makeGetLogInFailureRoute()
			);
			main.post(
		`${prefix}/register`,
		createGuestGuard(),
		createJSONBodyParser(),
		makePostRegisterRoute(manager),
		makePostLogInRoute(manager)
	);

	main.post(
		`${prefix}/log_out`,
		createAuthorizationGuard(null),
		makePostLogOutRoute()
	)
	main.get(
		`${prefix}/list`,
		createAuthorizationGuard(null),
		makeGetListRoute(manager)
	)
	main.get(
		`${prefix}/update/:id`,
		createAuthorizationGuard(null),
		makePatchUpdateRoute(manager)
	)

	return { main }
}
