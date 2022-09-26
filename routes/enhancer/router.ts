import Router from "!/bases/router"
import GetIndex from "!%/enhancer/index.get"
import ChatRouter from "!%/enhancer/chat/router"
import UserRouter from "!%/enhancer/user/router"
import RoleRouter from "!%/enhancer/role/router"
import DepartmentRouter from "!%/enhancer/department/router"
import UserSettingsRouter from "!%/enhancer/settings/router"
import ConsultationRouter from "!%/enhancer/consultation/router"
import AdminResourceConfigRouter from "!%/enhancer/admin/resource_config/router"

export default class extends Router {
	constructor() {
		super()

		this.useRouters([
			new UserRouter(),
			new AdminResourceConfigRouter(),
			new ConsultationRouter(),
			new ChatRouter(),
			new RoleRouter(),
			new DepartmentRouter(),
			new UserSettingsRouter()
		])

		this.useController(new GetIndex())
	}
}
