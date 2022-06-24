import Router from "!/bases/router"
import PostMultipartRoute from "!/app/routes/t/multipart.post"

export default class extends Router {
	constructor() {
		super()

		this.useController(new PostMultipartRoute())
	}
}
