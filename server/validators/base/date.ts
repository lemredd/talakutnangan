import type { ValidationState, ValidationConstraints } from "!/types/validation"

/**
 * Validator to check if data is a valid date
 */
export default async function(
	currentState: Promise<ValidationState>,
	constraints: ValidationConstraints
): Promise<ValidationState> {
	const state = await currentState

	if (state.maySkip) return state

	const { value } = state

	const castedValue = new Date(value)

	if (castedValue.toString() === "Invalid Date") {
		const error = {
			"field": value,
			"friendlyName": constraints.friendlyName,
			"messageMaker": (field: string) => `Field "${field}" must be a date.`
		}

		throw error
	} else {
		state.value = castedValue
	}

	return state
}
