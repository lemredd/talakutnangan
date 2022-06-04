import Router from "!/bases/router"
import Controller from "!/bases/controller"
import GetJoin from "!/app/routes/chat/join.get"

export default class extends Router {
	get prefix(): string { return "/chat" }

	constructor() {
		super()

		this.useController(new GetJoin())
	}
}
