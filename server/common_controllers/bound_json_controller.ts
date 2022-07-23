import type { BaseManagerClass } from "!/types/independent"

import Validation from "!/bases/validation"
import JSONController from "!/common_controllers/json_controller"
import IDParameterValidation from "!/middlewares/validation/id_parameter"
import MatchedIDParameterValidation from "!/middlewares/validation/matched_id_parameter"

/**
 * Specialized controller class which accept JSON as their request body and requires ID to match an
 * exisiting model in the database .
 */
export default abstract class extends JSONController {
	get validations(): Validation[] {
		return [
			new IDParameterValidation([
				[ "id", this.manager ]
			]),
			...this.validations,
			new MatchedIDParameterValidation()
		]
	}

	abstract get manager(): BaseManagerClass
}
