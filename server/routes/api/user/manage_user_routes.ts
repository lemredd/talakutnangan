import { EntityManager } from "typeorm"
import { Router as createRouter, Router } from "express"

import { Routers } from "!/types"
import makeGetCreateRoute from "!/routes/api/user/create.get"
import makePostLoginRoute from "!/routes/api/user/log_in.post"
import createGuestGuard from "!/middlewares/create_guest_guard"
import createJSONBodyParser from "!/middlewares/create_json_body_parser"

export default function(manager: EntityManager): Routers {
	const router = createRouter()

	const prefix = "/user"
	router.get(`${prefix}/create`, makeGetCreateRoute(manager));
	router.use(createGuestGuard())
	router.use(createJSONBodyParser())
	router.post(
		`${prefix}/log_in`,
		makePostLoginRoute(manager)
	);

	return {
		prefixables: [ router ]
	}
}
