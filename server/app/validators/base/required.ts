import type { ValidationState } from "!/types/dependent"

/**
 * Validator to require the data
 */
export default async function(
	currentState: Promise<ValidationState>,
	constraints: any
): Promise<ValidationState> {
	const state = await currentState

	if (state.value) {
		return state
	} else {
		throw {
			field: state.field,
			messageMaker: (field: string) => `Field "${field}" is required.`
		}
	}
}
