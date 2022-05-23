import { EntityManager } from "typeorm"
import { Router as createRouter, Router } from "express"

import manageChatRoutes from "!/routes/chat/manage_chat_routes"
import manageAPIRoutes from "!/routes/api/manage_api_routes"

export default function(manager: EntityManager): Router {
	const main = createRouter()

	main.use(manageChatRoutes().main)
	main.use(manageAPIRoutes(manager).main)

	return main
}
