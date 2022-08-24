import type {
	ValidationState,
	ValidationConstraints,
	LengthConstraints
} from "!/types/validation"

import makeDeveloperError from "!/validators/make_developer_error"

/**
 * Validator to check if the size of a JSON is within the specific length.
 */
export default async function(
	currentState: Promise<ValidationState>,
	constraints: ValidationConstraints & Partial<LengthConstraints>
): Promise<ValidationState> {
	const state = await currentState

	if (state.maySkip) return state

	if (constraints.length === undefined) {
		throw makeDeveloperError(constraints.field)
	}

	const jsonLength = JSON.stringify(state.value).length

	if (
		constraints.length.minimum !== undefined
		&& jsonLength < constraints.length.minimum) {
		throw {
			"field": constraints.field,
			"messageMaker": (field: string) => `Field "${field}" must be more than or equal to ${
					constraints.length!.minimum
			} character(s).`
		}
	}

	if (
		constraints.length.maximum !== undefined
		&& constraints.length.maximum < jsonLength) {
		throw {
			"field": constraints.field,
			"messageMaker": (field: string) => `Field "${field}" must be less than or equal to ${
					constraints.length!.maximum
			} character(s).`
		}
	}

	return state
}
