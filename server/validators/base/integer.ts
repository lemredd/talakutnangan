import type {
	IntegerConstraints,
	ValidationState,
	ValidationConstraints
} from "!/types/validation"

/**
 * Validator to check if data is a valid integer
 */
export default async function(
	currentState: Promise<ValidationState>,
	constraints: ValidationConstraints & IntegerConstraints
): Promise<ValidationState> {
	const state = await currentState

	if (state.maySkip) return state

	const castedValue = Number(state.value)

	if (Number.isInteger(castedValue)) {
		if (constraints.integer && constraints.integer.mustCast) {
			state.value = castedValue
		}
	} else {
		const error = {
			"field": constraints.field,
			"friendlyName": constraints.friendlyName,
			"messageMaker": (field: string) => `Field "${field}" must be an integer.`
		}
		throw error
	}

	return state
}
