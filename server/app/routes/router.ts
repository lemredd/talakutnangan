import Router from "!/bases/router"
import GetIndex from "!/app/routes/index.get"
import TestRouter from "!/app/routes/t/router"
import DevRouter from "!/app/routes/dev/router"
import APIRouter from "!/app/routes/api/router"
import ChatRouter from "!/app/routes/chat/router"
import UserRouter from "!/app/routes/user/router"
import DepartmentRouter from "!/app/routes/department/router"
import { Environment } from "$/types/server"

export default class extends Router {
	get prefix(): string { return "/" }

	constructor() {
		super()

		this.useRouters([
			new APIRouter(),
			new UserRouter(),
			new ChatRouter(),
			new DepartmentRouter()
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
