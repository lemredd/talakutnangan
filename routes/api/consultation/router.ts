import Router from "!/bases/router"
import GetList from "!%/api/department/list.get"
import PostCreate from "!%/api/department/create.post"
import PatchUpdate from "!%/api/department/update(id).patch"
import PatchRestore from "!%/api/department/restore.patch"
import DeleteArchive from "!%/api/department/archive.delete"

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
