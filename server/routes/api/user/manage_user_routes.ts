import passport from "passport"
import { EntityManager } from "typeorm"
import { Router as createRouter } from "express"

import { Routers } from "!/types"

import Router from "!/routes/api/user/router"

export default function(manager: EntityManager): Routers {
	const newMain = new Router()

	const main = createRouter()

	main.use(newMain.routers.prefixedRouter)

	return { main }
}
