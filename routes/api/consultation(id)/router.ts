import Router from "!/bases/router"
import ReadRouter from "!%/api/consultation(id)/read/router"
import RequestRouter from "!%/api/consultation(id)/request/router"

export default class extends Router {
	constructor() {
		super()

		this.useRoutersAsync(new Promise(resolve => {
			resolve([
				new ReadRouter(),
				new RequestRouter()
			])
		}))
	}
}
