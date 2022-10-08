import Router from "!/bases/router"
import DeleteDestroy from "!%/api/attached_chat_file/destroy.delete"

export default class extends Router {
	constructor() {
		super()

		this.useControllersAsync(new Promise(resolve => {
			resolve([
				new DeleteDestroy()
			])
		}))
	}
}
