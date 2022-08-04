import Router from "!/bases/router"
import GetCreateRoute from "./create.get"
import GetUpdateRoute from "./update.get"

export default class extends Router {
	constructor() {
		super()

		this.useControllers([
			new GetCreateRoute(),
			new GetUpdateRoute()
		])
	}
}
