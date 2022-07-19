import Router from "!/bases/router"
import PolicyRouter from "!/app/routes/t/policy/router"
import PostMultipartRoute from "!/app/routes/t/multipart.post"
import GetAuthorizationRoute from "!/app/routes/t/authorization_error.get"

export default class extends Router {
	constructor() {
		super()

		this.useControllers([
			new PostMultipartRoute(),
			new GetAuthorizationRoute()
		])

		this.useRouters([
			new PolicyRouter()
		])
	}
}
