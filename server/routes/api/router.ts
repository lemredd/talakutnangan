import Router from "!/helpers/router"
import UserRouter from "!/routes/api/user/router"

export default class extends Router {
	constructor() {
		const prefix = "/api"
		super(prefix)

		this.useRouter(new UserRouter(prefix))
	}
}
