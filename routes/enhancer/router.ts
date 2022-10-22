import Router from "!/bases/router"
import GetIndex from "!%/enhancer/index.get"
import UserRouter from "!%/enhancer/user/router"
import RoleRouter from "!%/enhancer/role/router"
import PostRouter from "!%/enhancer/post/router"
import ForumRouter from "!%/enhancer/forum/router"
import DepartmentRouter from "!%/enhancer/department/router"
import UserSettingsRouter from "!%/enhancer/settings/router"
import ConsultationRouter from "!%/enhancer/consultation/router"

export default class extends Router {
	constructor() {
		super()

		this.useRoutersAsync(new Promise(resolve => {
			resolve([
				new UserRouter(),
				new RoleRouter(),
				new PostRouter(),
				new ForumRouter(),
				new DepartmentRouter(),
				new ConsultationRouter(),
				new UserSettingsRouter()
			])
		}))

		this.useControllersAsync(new Promise(resolve => {
			resolve([ new GetIndex() ])
		}))
	}
}
