import { EntityManager } from "typeorm"
import { Router as createRouter } from "express"
import manageUserRoutes from "!/routes/api/user/manage_user_routes"

export default function(manager: EntityManager) {
	const router = createRouter()

	const prefix = "/api"
	router.use(prefix, manageUserRoutes(manager));

	return router
}
