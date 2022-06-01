import Router from "!/helpers/router"
import GetEmailVerificationRoute from "!/routes/dev/email_verification.get"

export default class extends Router {
	constructor(parentPrefix: string) {
		super("/dev")

		this.useController(new GetEmailVerificationRoute())
	}
}
