import Controller from "!/helpers/controller"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"

export default abstract class extends Controller {
	constructor(URL: string) {
		super("post", URL)

		this.prependMiddleware(CommonMiddlewareList.guestPageGuard)
		this.prependMiddleware(CommonMiddlewareList.JSONBody)
	}
}
