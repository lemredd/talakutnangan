import Router from "!/bases/router"
import GetList from "!/app/routes/api/role/list.get"
import PostCreate from "!/app/routes/api/role/create.post"
import PatchUpdate from "!/app/routes/api/role/update(id).patch"
import PatchRestore from "!/app/routes/api/role/restore.patch"
import DeleteArchive from "!/app/routes/api/role/archive.delete"

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
