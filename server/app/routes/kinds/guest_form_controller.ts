import Middleware from "!/bases/middleware"
import JSONController from "!/bases/controller-likes/json_controller-like/controller"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"

export default abstract class extends JSONController {
	get middlewares(): Middleware[] {
		return [
			CommonMiddlewareList.guestOnlyPolicy,
			...super.middlewares
		]
	}
}
