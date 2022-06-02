import Router from "!/routes/bases/router"
import APIRouter from "!/routes/api/router"
import ChatRouter from "!/routes/chat/router"

export default class extends Router {
	get prefix(): string { return "/" }

	constructor() {
		super()

		this.useRouters([
			new ChatRouter(),
			new APIRouter()
		])
	}
}
