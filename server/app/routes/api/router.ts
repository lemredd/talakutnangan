import Router from "!/bases/router"
import UserRouter from "!/app/routes/api/user/router"
import RoleRouter from "!/app/routes/api/role/router"
import DepartmentRouter from "!/app/routes/api/department/router"

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
