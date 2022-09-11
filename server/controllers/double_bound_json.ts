import Validation from "!/bases/validation"
import BoundJSONController from "!/controllers/bound_json"
import MatchedIDParameterValidation from "!/validations/matched_id_parameter"

/**
 * Specialized controller class which:
 * - Requires ID parameter to match an existing model in the database
 * - Accept JSON as their request body
 * - The ID parameter is same with ID in the JSON
 *
 * Automatically casts the data ID to integer.
 */
export default abstract class extends BoundJSONController {
	get postBodyValidations(): Validation[] {
		return [
			new MatchedIDParameterValidation()
		]
	}
}
