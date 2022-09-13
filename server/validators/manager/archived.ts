import type { Request } from "!/types/dependent"
import type {
	ValidationState,
	ValidationConstraints,
	ManagerBasedRuleConstraints
} from "!/types/validation"

import isUndefined from "$/type_guards/is_undefined"
import makeDeveloperError from "!/validators/make_developer_error"

/**
 * Validator to check if data belongs to an archived model in the database
 */
export default async function(
	currentState: Promise<ValidationState>,
	constraints: ValidationConstraints<Request> & Partial<ManagerBasedRuleConstraints>
): Promise<ValidationState> {
	const state = await currentState

	if (state.maySkip) return state

	if (isUndefined(constraints.manager)) {
		throw makeDeveloperError(constraints.field)
	}

	// eslint-disable-next-line new-cap
	const manager = new constraints.manager.className(constraints.request)
	const foundModel = await manager.findOneOnColumn(constraints.manager.columnName, state.value, {
		"filter": {
			"existence": "archived"
		}
	})

	if (foundModel.data === null) {
		const error = {
			"field": constraints.field,
			"friendlyName": constraints.friendlyName,
			"messageMaker": (
				field: string,
				value: string
			) => `The ${value} in field "${field}" is not archived in the database".`
		}

		throw error
	} else {
		return state
	}
}
