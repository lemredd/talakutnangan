import Router from "!/bases/router"
import PostCreate from "!/app/routes/api/role/create.post"

export default class extends Router {
	constructor() {
		super()

		this.useControllers([
			new PostCreate()
		])
	}
}
