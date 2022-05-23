import { Router as createRouter } from "express"

import { Routers } from "!/types"
import getJoinRoute from "!/routes/chat/join.get"

export default function(): Routers {
	const router = createRouter()

	const prefix = "/chat"
	router.get(`${prefix}/join`, getJoinRoute);

	return {
		prefixables: [ router ]
	}
}
