import Router from "!/bases/router"
import GetRead from "!%/api/signature/read(id).get"

export default class extends Router {
	constructor() {
		super()

		this.useControllers([
			new GetRead()
		])
	}
}
