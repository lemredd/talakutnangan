import Router from "!/bases/router"
import GetReadRoute from "!%/enhancer/role/read(id).get"
import GetCreateRoute from "!%/enhancer/role/create.get"

export default class extends Router {
	constructor() {
		super()

		this.useControllers([
			new GetReadRoute(),
			new GetCreateRoute()
		])
	}
}
