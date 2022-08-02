import type { Request } from "!/types/dependent"
import type { FieldRules } from "!/types/validation"

import Middleware from "!/bases/middleware"
import Validation from "!/bases/validation"
import BodyValidation from "!/middlewares/validation/body"
import Controller from "!/bases/controller-likes/controller"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"

/**
 * Specialized controller class which accept JSON as their request body.
 */
export default abstract class extends Controller {
	get bodyParser(): Middleware {
		return CommonMiddlewareList.JSONBody
	}

	get validations(): Validation[] {
		return [
			new BodyValidation(
				this.makeBodyRuleGenerator.bind(this)
			)
		]
	}

	abstract makeBodyRuleGenerator(request: Request): FieldRules
}
