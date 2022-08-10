import Router from "!/bases/router"
import GetIndex from "!%/index.get"
import DevRouter from "!%/dev/router"
import APIRouter from "!%/api/router"
import TestRouter from "!%/t/router"
import ChatRouter from "!%/chat/router"
import UserRouter from "!%/user/router"
import AdminResourceConfigRouter from "!%/admin/resource_config/router"
import DepartmentRouter from "!%/department/router"
import UserSettingsRouter from "!%/settings/router"
import { Environment } from "$/types/server"

export default class extends Router {
	get prefix(): string { return "/" }

	constructor() {
		super()

		this.useRouters([
			new APIRouter(),
			new UserRouter(),
			new AdminResourceConfigRouter(),
			new ChatRouter(),
			new DepartmentRouter(),
			new UserSettingsRouter()
		])

		this.useController(new GetIndex())

		switch(this.environment) {
			case Environment.Development:
				this.useRouter(new DevRouter())
			case Environment.IntegrationTest:
				this.useRouter(new TestRouter())
			default:
		}
	}
}
