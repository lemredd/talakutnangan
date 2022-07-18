import Router from "!/bases/router"
import GetVerify from "!/app/routes/user/verify(data).get"

export default class extends Router {

	constructor() {
		super()

		this.useController(new GetVerify())
	}
}
