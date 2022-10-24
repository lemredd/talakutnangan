import GetIndexRoute from "!%/enhancer/consultation/index.get"
import GetFormRoute from "!%/enhancer/consultation/form(id).get"
import GetReadRoute from "!%/enhancer/consultation/read(id).get"
import GetReportRoute from "!%/enhancer/consultation/report.get"

export const controllers = [
	GetFormRoute,
	GetReadRoute,
	GetReportRoute,
	GetIndexRoute
]
