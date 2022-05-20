import { EntityManager } from "typeorm"
import { Router as createRouter } from "express"
import manageChatRoutes from "!/routes/chat/manage_chat_routes"
import manageAPIRoutes from "!/routes/api/manage_api_routes"

export default function(manager: EntityManager) {
	const router = createRouter()

	router.use(manageChatRoutes())
	router.use(manageAPIRoutes(manager))

	return router
}
