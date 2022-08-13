import type { Request } from "!/types/dependent"
import type { Pipe, FieldRules } from "!/types/validation"

import Middleware from "!/bases/middleware"
import Validation from "!/bases/validation"
import BodyValidation from "!/validations/body"
import exists from "!/validators/manager/exists"
import BoundController from "!/controllers/bound"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"
import MatchedIDParameterValidation from "!/validations/matched_id_parameter"

/**
 * Specialized controller class which accept JSON as their request body and requires ID to match an
 * exisiting model in the database.
 *
 * Automatically casts the data ID to integer.
 */
export default abstract class extends BoundController {
	get bodyParser(): Middleware {
		return CommonMiddlewareList.JSONBody
	}

	get postBoundValidations(): Validation[] {
		return [
			new BodyValidation(
				this.makeBodyRuleGenerator.bind(this)
			),
			new MatchedIDParameterValidation()
		]
	}

	protected get boundPipe(): Pipe { return exists }

	abstract makeBodyRuleGenerator(unusedRequest: Request): FieldRules
}
