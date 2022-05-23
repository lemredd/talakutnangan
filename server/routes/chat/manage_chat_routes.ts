import { Router as createRouter } from "express"

import { Routers } from "!/types"
import getJoinRoute from "!/routes/chat/join.get"

export default function(): Routers {
	const main = createRouter()

	const prefix = "/chat"
	main.get(`${prefix}/join`, getJoinRoute);

	return { main }
}
