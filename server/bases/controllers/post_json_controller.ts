import Middleware from "!/bases/middleware"
import PostController from "!/bases/controllers/post_controller"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"
import BodyValidation from "!/middlewares/authorization/body_validation"

export default abstract class extends PostController {
	getPremiddlewares(): Middleware[] {
		return [
			...super.getPremiddlewares(),
			CommonMiddlewareList.JSONBody,
			new BodyValidation(this.validationRules)
		]
	}

	abstract get validationRules(): object;
}
