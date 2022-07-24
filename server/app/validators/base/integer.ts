import type { ValidationState } from "!/types/dependent"

/**
 * Validator to check if data is a valid integer
 */
export default async function(
	currentState: Promise<ValidationState>,
	constraints: any
): Promise<ValidationState> {
	const state = await currentState

	state.value = Number(state.value)

	if (Number.isInteger(state.value)) {
		return state
	} else {
		throw {
			field: state.field,
			messageMaker: (field: string) => `Field "${field}" must be an integer.`
		}
	}
}
