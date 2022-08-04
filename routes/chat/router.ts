import Router from "!/bases/router"
import GetJoin from "!%/chat/join.get"
import GetRoom from "!%/chat/room(uuid).get"

export default class extends Router {
	constructor() {
		super()

		this.useControllers([
			new GetJoin(),
			new GetRoom()
		])
	}
}
