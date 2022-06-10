import Router from "!/bases/router"
import GetJoin from "!/app/routes/chat/join.get"
import GetRoom from "!/app/routes/chat/room(uuid).get"

export default class extends Router {
	constructor() {
		super()

		this.useControllers([
			new GetJoin(),
			new GetRoom()
		])
	}
}
