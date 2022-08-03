import Router from "!/bases/router"
import GetIDParameterRoute from "!%/t/validation/id_parameter(id).get"

export default class extends Router {
	constructor() {
		super()

		this.useControllers([
			new GetIDParameterRoute()
		])
	}
}
