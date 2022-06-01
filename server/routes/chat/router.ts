import Router from "!/helpers/router"
import Controller from "!/helpers/controller"
import GetJoin from "!/routes/chat/join.get"

export default class extends Router {
	get prefix(): string { return "/chat" }

	constructor() {
		super()

		this.useController(new GetJoin())
	}
}
