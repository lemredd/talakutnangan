import { EntityManager } from "typeorm"
import { Router as createRouter, Router } from "express"

import { Routers } from "!/types"
import makeGetCreateRoute from "!/routes/api/user/create.get"
import makePostLoginRoute from "!/routes/api/user/log_in.post"
import createGuestGuard from "!/middlewares/create_guest_guard"
import createJSONBodyParser from "!/middlewares/create_json_body_parser"

export default function(manager: EntityManager): Routers {
	const main = createRouter()

	const prefix = "/user"
	main.get(`${prefix}/create`, makeGetCreateRoute(manager));
	main.use(createGuestGuard())
	main.use(createJSONBodyParser())
	main.post(
		`${prefix}/log_in`,
		makePostLoginRoute(manager)
	);

	return { main }
}
