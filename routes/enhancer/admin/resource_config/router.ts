import Router from "!/bases/router"
import GetIndex from "!%/enhancer/admin/resource_config/index.get"
import GetUsersRoute from "!%/enhancer/admin/resource_config/users.get"
import GetDepartmentsRoute from "!%/enhancer/admin/resource_config/departments.get"

export default class extends Router {
	constructor() {
		super()

		this.useControllers([
			new GetIndex(),
			new GetUsersRoute(),
			new GetDepartmentsRoute()
		])
	}
}
