import Router from "!/bases/router"
import PutUpdate from "!/app/routes/api/role/update.put"
import PostCreate from "!/app/routes/api/role/create.post"
import PatchRestore from "!/app/routes/api/role/restore(id).patch"
import DeleteArchive from "!/app/routes/api/role/archive(id).delete"

export default class extends Router {
	constructor() {
		super()

		this.useControllers([
			new PutUpdate(),
			new PostCreate(),
			new PatchRestore(),
			new DeleteArchive()
		])
	}
}
