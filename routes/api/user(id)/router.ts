import Router from "!/bases/router"
import RelationshipRouter from "!%/api/user(id)/relationships/router"

export default class extends Router {
	constructor() {
		super()

		this.useRouters([
			new RelationshipRouter()
		])
	}
}
