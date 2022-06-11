import Router from "!/bases/router"
import UserRouter from "!/app/routes/api/user/router"
import DepartmentRouter from "!/app/routes/api/department/router"

export default class extends Router {
	constructor() {
		super()

		this.useRouters([
			new UserRouter(),
			new DepartmentRouter()
		])
	}
}
