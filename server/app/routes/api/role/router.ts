import Router from "!/bases/router"
import GetList from "!/app/routes/api/role/list.get"
import PostCreate from "!/app/routes/api/role/create.post"
import PatchRestore from "!/app/routes/api/role/restore.patch"
import PatchUpdate from "!/app/routes/api/role/update(id).patch"
import DeleteArchive from "!/app/routes/api/role/archive.delete"
import GetCountUsers from "!/app/routes/api/role/count_users.get"

export default class extends Router {
	constructor() {
		super()

		this.useControllers([
			new GetList(),
			new PostCreate(),
			new PatchUpdate(),
			new PatchRestore(),
			new DeleteArchive(),
			new GetCountUsers()
		])
	}
}
