import Middleware from "!/routes/bases/middleware"
import PostJSONController from "!/routes/bases/controllers/post_json_controller"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"

export default abstract class extends PostJSONController {
	getPremiddlewares(): Middleware[] {
		return [
			CommonMiddlewareList.guestPageGuard,
			...super.getPremiddlewares()
		]
	}
}
