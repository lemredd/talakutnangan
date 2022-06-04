import Middleware from "!/bases/middleware"
import PostJSONController from "!/bases/controllers/post_json_controller"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"

export default abstract class extends PostJSONController {
	getPremiddlewares(): Middleware[] {
		return [
			CommonMiddlewareList.guestPageGuard,
			...super.getPremiddlewares()
		]
	}
}
