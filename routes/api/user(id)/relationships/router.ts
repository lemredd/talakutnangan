import Router from "!/bases/router"
import SignatureRouter from "!%/api/user(id)/relationships/signature/router"

export default class extends Router {
	constructor() {
		super()

		this.useRouters([
			new SignatureRouter()
		])
	}
}
