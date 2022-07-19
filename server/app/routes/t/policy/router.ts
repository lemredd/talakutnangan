import Router from "!/bases/router"
import GetKindBasedRoute from "!/app/routes/t/policy/kind-based.get"
import GetPermissionBasedRoute from "!/app/routes/t/policy/permission-based.get"

export default class extends Router {
	constructor() {
		super()

		this.useControllers([
			new GetKindBasedRoute(),
			new GetPermissionBasedRoute()
		])
	}
}
