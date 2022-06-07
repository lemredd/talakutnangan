import Router from "!/bases/router"
import UserRouter from "!/app/routes/api/user/router"

export default class extends Router {
	constructor() {
		super()

		this.useRouter(new UserRouter())
	}
}
