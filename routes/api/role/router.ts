import Router from "!/bases/router"
import GetList from "!%/api/role/list.get"
import PostCreate from "!%/api/role/create.post"
import PatchRestore from "!%/api/role/restore.patch"
import PatchUpdate from "!%/api/role/update(id).patch"
import DeleteArchive from "!%/api/role/archive.delete"
import GetCountUsers from "!%/api/role/count_users.get"

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
