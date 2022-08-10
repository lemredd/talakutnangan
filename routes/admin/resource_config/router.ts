import Router from "!/bases/router"
import GetUsersRoute from "./users.get"
import GetRolesRoute from "./roles.get"
import GetDepartmentsRoute from "./departments.get"

export default class extends Router {
	constructor() {
		super()

		this.useControllers([
			new GetUsersRoute()
		])
	}
}
