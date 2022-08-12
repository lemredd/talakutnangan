import Router from "!/bases/router"
import GetIndex from "./index.get"
import GetUsersRoute from "./users.get"
import GetRolesRoute from "./roles.get"
import GetDepartmentsRoute from "./departments.get"

export default class extends Router {
	constructor() {
		super()

		this.useControllers([
			new GetIndex(),
			new GetUsersRoute(),
			new GetRolesRoute(),
			new GetDepartmentsRoute()
		])
	}
}
