import Router from "!/bases/router"
import PostCreate from "!%/api/employee_schedule/create.post"
import PatchRestore from "!%/api/employee_schedule/restore.patch"
import PatchUpdate from "!%/api/employee_schedule/update(id).patch"
import DeleteArchive from "!%/api/employee_schedule/archive.delete"

export default class extends Router {
	constructor() {
		super()

		this.useControllers([
			new PostCreate(),
			new PatchUpdate(),
			new PatchRestore(),
			new DeleteArchive()
		])
	}
}
