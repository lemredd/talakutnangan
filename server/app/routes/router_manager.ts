import Router from "!/bases/router"
import GetIndex from "!/app/routes/index.get"
import DevRouter from "!/app/routes/dev/router"
import APIRouter from "!/app/routes/api/router"
import ChatRouter from "!/app/routes/chat/router"
import { Environment } from "!/types/independent"

export default class extends Router {
	get prefix(): string { return "/" }

	constructor() {
		super()

		this.useRouters([
			new APIRouter(),
			new ChatRouter()
		])

		this.useController(new GetIndex())

		switch(this.environment) {
			case Environment.Development:
				this.useRouter(new DevRouter())
			default:
		}
	}
}
