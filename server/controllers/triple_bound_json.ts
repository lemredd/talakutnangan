import type { Rules } from "!/types/validation"
import DoubleBoundJSONController from "!/controllers/double_bound_json"
import doesBelongToCurrentUser from "!/validators/manager/does_belong_to_current_user"

/**
 * Specialized controller class which:
 * - Requires ID parameter to match an existing model in the database
 * - Accept JSON as their request body
 * - The ID parameter is same with ID in the JSON
 * - Resource belongs to current user or has enough permission if applicable
 *
 * Automatically casts the data ID to integer.
 */
export default abstract class extends DoubleBoundJSONController {
	protected get extraIDParameterValidation(): Rules {
		return {
			"pipes": [ doesBelongToCurrentUser ]
		}
	}
}
