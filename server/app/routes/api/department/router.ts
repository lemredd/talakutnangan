import Router from "!/bases/router"
import GetList from "!/app/routes/api/department/list.get"
import PostCreate from "!/app/routes/api/department/create.post"
import PatchUpdate from "!/app/routes/api/department/update(id).patch"
import PatchRestore from "!/app/routes/api/department/restore.patch"
import DeleteArchive from "!/app/routes/api/department/archive.delete"

export default class extends Router {
	constructor() {
		super()

		this.useControllers([
			new GetList(),
			new PostCreate(),
			new PatchUpdate(),
			new PatchRestore(),
			new DeleteArchive()
		])
	}
}
