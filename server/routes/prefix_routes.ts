import { Router } from "express"
import { Routers } from "!/types"

export default function(prefix: string, parentRouter: Router, routers: Routers) {
	for (const subrouter of routers.prefixables) {
		parentRouter.use(prefix, subrouter)
	}
}
