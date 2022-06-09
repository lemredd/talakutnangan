import Router from "!/bases/router"
import GetRead from "!/app/routes/api/department/read.get"

export default class extends Router {
	constructor() {
		super()

		this.useControllers([
			new GetRead()
		])
	}
}
