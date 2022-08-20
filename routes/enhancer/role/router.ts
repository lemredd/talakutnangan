import Router from "!/bases/router"
import GetCreateRoute from "./create.get"
import GetIDRoute from "./id.get"

export default class extends Router {
	constructor() {
		super()

		this.useControllers([
			new GetCreateRoute(),
			new GetIDRoute()
		])
	}
}
