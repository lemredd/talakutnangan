import Router from "!/bases/router"
import GetList from "!%/api/comment/list.get"
import PostCreate from "!%/api/comment/create.post"
import PatchRestore from "!%/api/comment/restore.patch"
import DeleteArchive from "!%/api/comment/archive.delete"
import PatchUpdate from "!%/api/comment/update(id).patch"

export default class extends Router {
	constructor() {
		super()

		this.useControllersAsync(new Promise(resolve => {
			resolve([
				new GetList(),
				new PostCreate(),
				new PatchUpdate(),
				new PatchRestore(),
				new DeleteArchive()
			])
		}))
	}
}
