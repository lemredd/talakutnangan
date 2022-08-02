import Router from "!/bases/router"
import UserRouter from "!%/api/user/router"
import RoleRouter from "!%/api/role/router"
import DepartmentRouter from "!%/api/department/router"

export default class extends Router {
	constructor() {
		super()

		this.useRouters([
			new UserRouter(),
			new RoleRouter(),
			new DepartmentRouter()
		])
	}
}
