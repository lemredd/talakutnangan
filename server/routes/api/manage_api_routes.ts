import { EntityManager } from "typeorm"
import { Router as createRouter } from "express"

import { Routers } from "!/types"
import manageUserRoutes from "!/routes/api/user/manage_user_routes"

export default function(manager: EntityManager): Routers {
	const prefix = "/api"
	const main = createRouter()

	main.use(prefix, manageUserRoutes(manager).main)

	return { main }
}
