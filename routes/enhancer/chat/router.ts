import Router from "!/bases/router"
import GetJoin from "!%/enhancer/chat/join.get"
import GetRoom from "!%/enhancer/chat/room(uuid).get"

export default class extends Router {
	constructor() {
		super()

		this.useControllersAsync(new Promise(resolve => {
			resolve([
				new GetJoin(),
				new GetRoom()
			])
		}))
	}
}
