import Router from "!/bases/router"
import PostCreate from "!%/api/department/create.post"
import PatchUpdate from "!%/api/department/update(id).patch"
import PatchRestore from "!%/api/department/restore.patch"

export default class extends Router {
	constructor() {
		super()

		this.useControllers([
			new PostCreate(),
			new PatchUpdate(),
			new PatchRestore()
		])
	}
}
