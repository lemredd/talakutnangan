import type { Request } from "!/types/dependent"
import type { FieldRules } from "!/types/validation"

import Middleware from "!/bases/middleware"
import Validation from "!/bases/validation"
import BodyValidation from "!/validations/body"
import Controller from "!/bases/controller-likes/controller"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"

/**
 * Specialized controller class which multipart form.
 */
export default abstract class extends Controller {
	get bodyParser(): Middleware {
		return CommonMiddlewareList.multipart
	}

	get validations(): Validation[] {
		return [
			new BodyValidation(
				this.makeBodyRuleGenerator.bind(this)
			)
		]
	}

	abstract makeBodyRuleGenerator(unusedRequest: Request): FieldRules
}
