import passport from "passport"
import { EntityManager } from "typeorm"
import { Router as createRouter } from "express"
import makeGetCreateRoute from "!/routes/api/user/create.get"
import makePostLoginRoute from "!/routes/api/user/log_in.post"
import createJSONBodyParser from "!/middlewares/create_json_body_parser"

export default function(manager: EntityManager) {
	const router = createRouter()

	const prefix = "/user"
	router.get(`${prefix}/create`, makeGetCreateRoute(manager));
	router.use(createJSONBodyParser())
	router.post(
		`${prefix}/log_in`,
		passport.authenticate("local", { failureRedirect: "/log_in" }),
		makePostLoginRoute(manager)
	);

	return router
}
