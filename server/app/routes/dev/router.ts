import Router from "!/bases/router"
import GetEmailVerificationRoute from "!/app/routes/dev/email_verification.get"

export default class extends Router {
	get prefix():string { return "/dev" }

	constructor() {
		super()

		this.useController(new GetEmailVerificationRoute())
	}
}
