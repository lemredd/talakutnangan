import Router from "!/helpers/router"
import UserRouter from "!/routes/api/user/router"

export default class extends Router {
	get prefix(): string { return "/api" }

	constructor() {
		super()

		this.useRouter(new UserRouter(this.prefix))
	}
}
