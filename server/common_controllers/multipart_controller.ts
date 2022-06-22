import Middleware from "!/bases/middleware"
import Validation from "!/bases/validation"
import Controller from "!/bases/controller-likes/controller"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"
import BodyValidation from "!/middlewares/authorization/body_validation"

/**
 * Specialized controller class which multipart form.
 */
export default abstract class extends Controller {
	get bodyParser(): Middleware {
		return CommonMiddlewareList.multipart
	}

	get validations(): Validation[] {
		return [
			new BodyValidation(this.bodyValidationRules)
		]
	}

	abstract get bodyValidationRules(): object;
}
