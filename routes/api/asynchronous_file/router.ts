import Router from "!/bases/router"
import GetRead from "!%/api/asynchronous_file/read(id).get"

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
