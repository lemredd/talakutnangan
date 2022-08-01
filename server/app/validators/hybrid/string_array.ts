import type {
	ValidationState,
	ValidationConstraints,
	ArrayRuleConstraints
} from "!/types/validation"

import string from "!/app/validators/base/string"
import array from "!/app/validators/base/array"

/**
 * Validator to check if data is a string with comma-delimited values
 */
export default async function(
	currentState: Promise<ValidationState>,
	constraints: ValidationConstraints & Partial<ArrayRuleConstraints>
): Promise<ValidationState> {
	const state = await string(currentState, constraints)

	if(state.maySkip) return state

	state.value = (state.value as string).split(",")

	return await array(Promise.resolve(state), constraints)
}
