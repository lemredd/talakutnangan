import Router from "!/bases/router"
import GetList from "!%/api/consultation/list.get"
import PostCreate from "!%/api/consultation/create.post"
import PatchUpdate from "!%/api/consultation/update(id).patch"
// import PatchRestore from "!%/api/consultation/restore.patch"
// import DeleteArchive from "!%/api/consultation/archive.delete"

export default class extends Router {
	constructor() {
		super()

		this.useControllers([
			new GetList(),
			new PostCreate(),
			new PatchUpdate(),
			// new PatchRestore(),
			// new DeleteArchive()
		])
	}
}
