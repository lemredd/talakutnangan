import validator from "validator"

import type {
	ValidationState,
	ValidationConstraints,
} from "!/types/validation"

/**
 * Validator to check if data is the proper acronym of the other field
 */
export default async function(
	currentState: Promise<ValidationState>,
	constraints: ValidationConstraints
): Promise<ValidationState> {
	const state = await currentState

	if(state.maySkip) return state

	if (validator.isEmail(state.value)) {
		return state
	} else {
		throw {
			field: constraints.field,
			messageMaker: (field: string) => `Field "${field}" must be valid email.`
		}
	}
}
