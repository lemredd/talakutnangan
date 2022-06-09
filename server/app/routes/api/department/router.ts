import Router from "!/bases/router"
import GetRead from "!/app/routes/api/department/read.get"
import PostCreate from "!/app/routes/api/department/create.post"
import PutUpdate from "!/app/routes/api/department/update(id).put"
import PatchRestore from "!/app/routes/api/department/restore(id).patch"
import DeleteArchive from "!/app/routes/api/department/archive(id).delete"

export default class extends Router {
	constructor() {
		super()

		this.useControllers([
			new GetRead(),
			new PutUpdate(),
			new PostCreate(),
			new PatchRestore(),
			new DeleteArchive()
		])
	}
}
