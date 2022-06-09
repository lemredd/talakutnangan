import Router from "!/bases/router"
import GetRead from "!/app/routes/api/department/read.get"
import PostCreate from "!/app/routes/api/department/create.post"
import PatchUpdate from "!/app/routes/api/department/update(id).patch"

export default class extends Router {
	constructor() {
		super()

		this.useControllers([
			new GetRead(),
			new PostCreate(),
			new PatchUpdate()
		])
	}
}
