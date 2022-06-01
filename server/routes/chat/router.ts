import Router from "!/routes/base/router"
import Controller from "!/routes/base/controller"
import GetJoin from "!/routes/chat/join.get"

export default class extends Router {
	get prefix(): string { return "/chat" }

	constructor() {
		super()

		this.useController(new GetJoin())
	}
}
