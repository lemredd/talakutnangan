import Router from "!/routes/bases/router"
import APIRouter from "!/routes/api/router"
import ChatRouter from "!/routes/chat/router"
import DevRouter from "!/routes/dev/router"
import { Environment } from "!/types"

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
