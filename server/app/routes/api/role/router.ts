import Router from "!/bases/router"
import PutUpdate from "!/app/routes/api/role/update.put"
import PostCreate from "!/app/routes/api/role/create.post"

export default class extends Router {
	constructor() {
		super()

		this.useControllers([
			new PutUpdate(),
			new PostCreate()
		])
	}
}
