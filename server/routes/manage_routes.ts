import { EntityManager } from "typeorm"
import { Router as createRouter, Router } from "express"

import { Routers } from "!/types"
import prefixRoutes from "!/routes/prefix_routes"
import manageChatRoutes from "!/routes/chat/manage_chat_routes"
import manageAPIRoutes from "!/routes/api/manage_api_routes"

export default function(manager: EntityManager): Router {
	const prefix = "/"
	const router = createRouter()

	prefixRoutes(prefix, router, manageChatRoutes())
	prefixRoutes(prefix, router, manageAPIRoutes(manager))

	return router
}
