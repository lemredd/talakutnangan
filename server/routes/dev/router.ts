import Router from "!/routes/bases/router"
import GetEmailVerificationRoute from "!/routes/dev/email_verification.get"

export default class extends Router {
	get prefix():string { return "/dev" }

	constructor() {
		super()

		this.useController(new GetEmailVerificationRoute())
	}
}
