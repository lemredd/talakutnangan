import Router from "!/bases/router"
import GetVerify from "!%/user/verify(data).get"

export default class extends Router {

	constructor() {
		super()

		this.useController(new GetVerify())
	}
}
