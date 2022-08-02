import Router from "!/bases/router"

import PolicyRouter from "!%/t/policy/router"
import ValidationRouter from "!%/t/validation/router"

import PostMultipartRoute from "!%/t/multipart.post"
import GetAuthorizationRoute from "!%/t/authorization_error.get"

export default class extends Router {
	constructor() {
		super()

		this.useControllers([
			new PostMultipartRoute(),
			new GetAuthorizationRoute()
		])

		this.useRouters([
			new PolicyRouter(),
			new ValidationRouter()
		])
	}
}
