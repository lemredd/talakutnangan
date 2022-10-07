import Router from "!/bases/router"
import GetList from "!%/api/department/list.get"
import PostCreate from "!%/api/department/create.post"
import PatchUpdate from "!%/api/department/update(id).patch"
import PatchRestore from "!%/api/department/restore.patch"
import DeleteArchive from "!%/api/department/archive.delete"
import GetCountUsers from "!%/api/department/count_users.get"

export default class extends Router {
	constructor() {
		super()

		this.useControllersAsync(new Promise(resolve => {
			resolve([
				new GetList(),
				new PostCreate(),
				new PatchUpdate(),
				new PatchRestore(),
				new DeleteArchive(),
				new GetCountUsers()
			])
		}))
	}
}
