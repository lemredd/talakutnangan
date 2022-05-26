import Router from "!/helpers/router"
import GetJoin from "!/routes/chat/join.get"

export default class extends Router {
	constructor() {
		const prefix = "/chat"
		super(prefix)

		this.useController(new GetJoin())
	}
}
