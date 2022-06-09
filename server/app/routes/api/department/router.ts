import Router from "!/bases/router"
import GetRead from "!/app/routes/api/department/read.get"
import PostCreate from "!/app/routes/api/department/create.post"
import PatchUpdate from "!/app/routes/api/department/update(id).patch"
import DeleteArchive from "!/app/routes/api/department/archive(id).delete"

export default class extends Router {
	constructor() {
		super()

		this.useControllers([
			new GetRead(),
			new PostCreate(),
			new PatchUpdate(),
			new DeleteArchive()
		])
	}
}
