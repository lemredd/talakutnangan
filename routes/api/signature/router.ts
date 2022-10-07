import Router from "!/bases/router"
import GetRead from "!%/api/signature/read(id).get"

export default class extends Router {
	constructor() {
		super()

		this.useControllersAsync(new Promise(resolve => {
			resolve([
				new GetRead()
			])
		}))
	}
}
