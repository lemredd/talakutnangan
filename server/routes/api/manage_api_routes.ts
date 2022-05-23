import { EntityManager } from "typeorm"
import { Router as createRouter } from "express"

import { Routers } from "!/types"
import prefixRoutes from "!/routes/prefix_routes"
import manageUserRoutes from "!/routes/api/user/manage_user_routes"

export default function(manager: EntityManager): Routers {
	const prefix = "/api"
	const router = createRouter()

	prefixRoutes(prefix, router, manageUserRoutes(manager))

	return {
		prefixables: [
			router
		]
	}
}
