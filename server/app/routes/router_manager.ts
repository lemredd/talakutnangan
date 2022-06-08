import Router from "!/bases/router"
import APIRouter from "!/app/routes/api/router"
import ChatRouter from "!/app/routes/chat/router"
import DevRouter from "!/app/routes/dev/router"
import { Environment } from "!/types/independent"

export default class extends Router {
	get prefix(): string { return "/" }

	constructor() {
		super()

		this.useRouters([
			new ChatRouter(),
			new APIRouter()
		])

		switch(this.environment) {
			case Environment.Development:
				this.useRouter(new DevRouter())
			default:
		}
	}
}
