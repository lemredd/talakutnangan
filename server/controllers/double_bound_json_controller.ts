import type { BaseManagerClass } from "!/types/independent"

import Validation from "!/bases/validation"
import JSONController from "!/controllers/json_controller"
import IDParameterValidation from "!/validations/id_parameter"
import MatchedIDParameterValidation from "!/validations/matched_id_parameter"

/**
 * Specialized controller class which accept JSON as their request body and requires ID to match an
 * exisiting model in the database.
 *
 * Automatically casts the data ID to integer.
 */
export default abstract class extends JSONController {
	get validations(): Validation[] {
		return [
			new IDParameterValidation([
				[ "id", this.manager ]
			]),
			...super.validations,
			new MatchedIDParameterValidation()
		]
	}

	abstract get manager(): BaseManagerClass
}
