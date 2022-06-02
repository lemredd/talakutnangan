import Router from "!/routes/bases/router"
import Controller from "!/routes/bases/controller"
import GetJoin from "!/routes/chat/join.get"

export default class extends Router {
	get prefix(): string { return "/chat" }

	constructor() {
		super()

		this.useController(new GetJoin())
	}
}
