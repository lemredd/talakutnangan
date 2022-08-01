import type {
	ValidationState,
	ValidationConstraints,
	SameRuleConstraints
} from "!/types/validation"

import makeDeveloperError from "!/app/validators/make_developer_error"

/**
 * Validator to check if data is the same as the data passed
 */
export default async function(
	currentState: Promise<ValidationState>,
	constraints: ValidationConstraints & Partial<SameRuleConstraints>
): Promise<ValidationState> {
	const state = await currentState

	if(state.maySkip) return state

	if (constraints.same === undefined) {
		throw makeDeveloperError(constraints.field)
	}

	if (state.value === constraints.same) {
		return state
	} else {
		throw {
			field: constraints.field,
			messageMaker: (field: string) => `Field "${field}" must be "${constraints.same}".`
		}
	}
}
