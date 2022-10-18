import Router from "!/bases/router"
import GetRead from "!%/enhancer/role(id)/read.get"

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
