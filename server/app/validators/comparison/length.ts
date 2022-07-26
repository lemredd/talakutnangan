import type {
	ValidationState,
	ValidationConstraints,
	LengthConstraints
} from "!/types/independent"

import makeDeveloperError from "!/app/validators/make_developer_error"

/**
 * Validator to check if th value is within the specific length.
 *
 * Only works if the value is guaranteed to be string or array.
 */
export default async function(
	currentState: Promise<ValidationState>,
	constraints: ValidationConstraints & Partial<LengthConstraints>
): Promise<ValidationState> {
	const state = await currentState

	if(state.maySkip) return state

	if (constraints.length === undefined) {
		throw makeDeveloperError(constraints.field)
	}

	const expectedSanitizeLength = state.value.length

	if (
		constraints.length.minimum !== undefined
		&& expectedSanitizeLength < constraints.length.minimum) {
		throw {
			field: constraints.field,
			messageMaker: (field: string) =>
				`Field "${field}" must have more than ${constraints.length!.minimum}.`
		}
	}

	if (
		constraints.length.maximum !== undefined
		&& constraints.length.maximum < expectedSanitizeLength) {
		throw {
			field: constraints.field,
			messageMaker: (field: string) =>
				`Field "${field}" must have more than ${constraints.length!.maximum}.`
		}
	}

	return state
}
