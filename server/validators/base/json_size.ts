import type {
	ValidationState,
	ValidationConstraints,
	SizeConstraints
} from "!/types/validation"

import makeDeveloperError from "!/validators/make_developer_error"

/**
 * Validator to check if the size of a JSON is within the specific length.
 */
export default async function(
	currentState: Promise<ValidationState>,
	constraints: ValidationConstraints & Partial<SizeConstraints>
): Promise<ValidationState> {
	const state = await currentState

	if (state.maySkip) return state

	if (typeof constraints.size === "undefined") {
		throw makeDeveloperError(constraints.field)
	}

	const jsonLength = JSON.stringify(state.value).length

	if (
		typeof constraints.size.minimum !== "undefined"
		&& jsonLength < constraints.size.minimum) {
		const error = {
			"field": constraints.field,
			"messageMaker": (
				field: string
			) => `Field "${field}" must be more than or equal to ${
				constraints.size?.minimum
			} character(s).`
		}

		throw error
	}

	if (
		typeof constraints.size.maximum !== "undefined"
		&& constraints.size.maximum < jsonLength) {
		const error = {
			"field": constraints.field,
			"messageMaker": (field: string) => `Field "${field}" must be less than or equal to ${
				constraints.size?.maximum
			} character(s).`
		}

		throw error
	}

	return state
}
