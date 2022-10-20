import Router from "!/bases/router"
import GetIndexRoute from "!%/enhancer/consultation/index.get"
import GetFormRoute from "!%/enhancer/consultation/form(id).get"
import GetReadRoute from "!%/enhancer/consultation/read(id).get"
import GetReportRoute from "!%/enhancer/consultation/report.get"

export default class extends Router {
	constructor() {
		super()

		this.useControllersAsync(new Promise(resolve => {
			resolve([
				new GetFormRoute(),
				new GetReadRoute(),
				new GetReportRoute(),
				new GetIndexRoute()
			])
		}))
	}
}
