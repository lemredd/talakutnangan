import Middleware from "!/bases/middleware"
import Controller from "!/bases/controller"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"
import BodyValidation from "!/middlewares/authorization/body_validation"

export default abstract class extends Controller {
	get middlewares(): Middleware[] {
		return [
			...super.middlewares,
			CommonMiddlewareList.JSONBody,
			new BodyValidation(this.validationRules)
		]
	}

	abstract get validationRules(): object;
}