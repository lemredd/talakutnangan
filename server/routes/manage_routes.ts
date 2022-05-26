import { EntityManager } from "typeorm"
import { Router as createRouter, Router } from "express"

import manageChatRoutes from "!/routes/chat/manage_chat_routes"
import APIRoutes from "!/routes/api/router"

export default function(manager: EntityManager): Router {
	const main = createRouter()

	main.use(manageChatRoutes().main)
	main.use((new APIRoutes()).combinedRouter)

	return main
}
