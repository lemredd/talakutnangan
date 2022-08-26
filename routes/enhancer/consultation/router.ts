import Router from "!/bases/router"
import GetCreateRoute from "!%/enhancer/consultation/index.get"

export default class extends Router {
	constructor() {
		super()

		this.useControllers([
			new GetCreateRoute()
		])
	}
}
