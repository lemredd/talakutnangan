import Router from "!/bases/router"
import GetIndex from "!%/settings/index.get"

export default class extends Router {

	constructor() {
		super()

		this.useControllers([
			new GetIndex(),
		])
	}
}
