import Router from "!/bases/router"
import GetRead from "!%/api/attached_chat_file/read(id).get"
import DeleteDestroy from "!%/api/attached_chat_file/destroy.delete"

export const controllers = [
	GetRead,
	DeleteDestroy
]

export default class extends Router {
	constructor() {
		super()

		this.useControllersAsync(new Promise(resolve => {
			resolve([
				new GetRead(),
				new DeleteDestroy()
			])
		}))
	}
}
