import { Router as createRouter } from "express"
import getJoinRoute from "!/routes/chat/join.get"

export default function() {
	const router = createRouter()

	const prefix = "/chat"
	router.get(`${prefix}/join`, getJoinRoute);

	return router
}
