import type {
	BooleanConstraints,
	ValidationState,
	ValidationConstraints
} from "!/types/validation"

import isBoolean from "validator/lib/isBoolean"
import toBoolean from "validator/lib/toBoolean"

/**
 * Validator to check if data is a valid boolean value.
 *
 * May accept "true", "false", "1", or "0" if constraints accepts loose comparison. Otherwise, it is
 * a strict type checking.
 */
export default async function(
	currentState: Promise<ValidationState>,
	constraints: ValidationConstraints & BooleanConstraints
): Promise<ValidationState> {
	const state = await currentState

	if(state.maySkip) return state

	const mayCheckLoosely = (constraints.boolean !== undefined)
		&& constraints.boolean.loose

	if (mayCheckLoosely) {
		const value = state.value+""
		if (isBoolean(value)) {
			state.value = toBoolean(value)
			return state
		}
	} else {
		if (state.value === true || state.value === false) {
			return state
		}
	}

	throw {
		field: constraints.field,
		messageMaker: (field: string) => `Field "${field}" should be a boolean.`
	}
}
