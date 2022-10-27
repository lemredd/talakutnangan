import GetIndexRoute from "!%/enhancer/consultation/index.get"
import GetFormRoute from "!%/enhancer/consultation/form(id).get"
import GetReadRoute from "!%/enhancer/consultation/read(id).get"
import { controllers as reportControllers } from "!%/enhancer/consultation/report/router"

export const controllers = [
	GetFormRoute,
	GetReadRoute,
	GetIndexRoute,
	...reportControllers
]
