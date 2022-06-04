import Router from "!/bases/router"
import UserRouter from "!/app/routes/api/user/router"

export default class extends Router {
	get prefix(): string { return "/api" }

	constructor() {
		super()

		this.useRouter(new UserRouter(this.prefix))
	}
}
