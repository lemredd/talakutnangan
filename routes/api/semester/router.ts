import Router from "!/bases/router"
import PostCreate from "!%/api/semester/create.post"
import DeleteArchive from "!%/api/semester/archive.delete"
import PatchUpdate from "!%/api/semester/update(id).patch"
import PatchRestore from "!%/api/semester/restore.patch"

export default class extends Router {
	constructor() {
		super()

		this.useControllers([
			new PostCreate(),
			new DeleteArchive(),
			new PatchUpdate(),
			new PatchRestore()
		])
	}
}
