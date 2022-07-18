import Router from "!/bases/router"
import GetPermissionBasedRoute from "!/app/routes/t/policy/permission-based.get"

export default class extends Router {
	constructor() {
		super()

		this.useControllers([
			new GetPermissionBasedRoute()
		])
	}
}
