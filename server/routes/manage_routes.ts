import { Router as createRouter } from "express"
import manageChatRoutes from "!/routes/chat/manage_chat_routes"

export default function() {
	const router = createRouter()

	router.use(manageChatRoutes())

	return router
}
