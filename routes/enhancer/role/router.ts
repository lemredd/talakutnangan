import Router from "!/bases/router"
import GetCreateRoute from "!%/enhancer/role/create.get"
import GetUpdateRoute from "!%/enhancer/role/update.get"

export default class extends Router {
	constructor() {
		super()

		this.useControllers([
			new GetCreateRoute(),
			new GetUpdateRoute()
		])
	}
}
