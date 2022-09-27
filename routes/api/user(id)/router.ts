import Router from "!/bases/router"
import RelationshipRouter from "!%/api/user(id)/relationships/router"
import PatchUpdatePassword from "!%/api/user(id)/update_password.patch"

export default class extends Router {
	constructor() {
		super()

		this.useControllers([
			new PatchUpdatePassword()
		])

		this.useRouters([
			new RelationshipRouter()
		])
	}
}
