import Router from "!/bases/router"
import GetIndexRoute from "!%/enhancer/consultation/index.get"
import GetReadRoute from "!%/enhancer/consultation/read(id).get"

export default class extends Router {
	constructor() {
		super()

		this.useControllers([
			new GetReadRoute(),
			new GetIndexRoute()
		])
	}
}
