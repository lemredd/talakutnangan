import Router from "!/bases/router"
import GetList from "!%/api/employee_schedule/list.get"
import PostCreate from "!%/api/employee_schedule/create.post"
import PatchUpdate from "!%/api/employee_schedule/update(id).patch"
import DeleteArchive from "!%/api/employee_schedule/archive.delete"

export default class extends Router {
	constructor() {
		super()

		this.useControllers([
			new GetList(),
			new PostCreate(),
			new PatchUpdate(),
			new DeleteArchive()
		])
	}
}
