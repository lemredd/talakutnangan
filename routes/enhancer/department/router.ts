import Router from "!/bases/router"
import GetCreateRoute from "!%/enhancer/department/create.get"

export default class extends Router {
	constructor() {
		super()

		this.useControllers([
			new GetCreateRoute()
		])
	}
}