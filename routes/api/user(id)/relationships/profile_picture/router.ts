import Router from "!/bases/router"
import PostCreate from "!%/api/user(id)/relationships/profile_picture/create.post"
import PatchUpdate from "!%/api/user(id)/relationships/profile_picture/update.patch"

export default class extends Router {
	constructor() {
		super()

		this.useControllers([
			new PatchUpdate(),
			new PostCreate()
		])
	}
}
